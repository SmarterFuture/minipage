import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import type { Context, Next } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { ObjectId, WithId } from "mongodb";

import { Err, Ok, TLogin, TReset, TRqReset, validateData, type ISession, type IUser, type Result } from "./types";
import { throwError } from "./funcs";
import { db } from "./setup";
import { BASE_URL, MAIL_LOGIN, MAIL_PASS, MAIL_USER, MAX_AGE } from "./consts";
import { setNext } from "./ciphers";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MAIL_LOGIN,
        pass: MAIL_PASS,
    },
});

export async function register(ctx: Context) {
    
    const body = validateData(await ctx.req.json(), TLogin);
    if ( !body.ok ) {
        return throwError(ctx, 400, body.error);
    }
    const { email, password } = body.data;

    const users = db.collection<IUser>("users");

    const exists = await users.findOne<WithId<IUser>>({ email });
    if ( exists ) {
        return throwError(ctx, 400, "User already exists");
    };

    const hashed = bcrypt.hash(password, 10);
    const verify_token = uuidv4();

    const p_result = users.insertOne({
        email,
        password: await hashed,
        is_verified: false,
        verify_token,
        reset_token: "",
        thread_id: "",
        active: new Date(),
        created: new Date(),
    } as IUser);

    const verifyUrl = `${BASE_URL}/verify?token=${verify_token}`;
    transporter.sendMail({
        from: MAIL_USER,
        to: email,
        subject: "Verify your email",
        text: `Click to verify: ${verifyUrl}`,
    });

    return p_result
        .then(_ => ctx.json({msg: "Registered"}));
}

export async function verifyEmail(ctx: Context, token: string) {
    const users = db.collection<IUser>("users");

    const user = await users.findOne<WithId<IUser>>({ verify_token: token });
    if (!user) { 
        throwError(ctx, 400, "Invalid token");
        return ctx.redirect("/?verified=false");
    };

    return users.updateOne(
            { _id: user._id },
            { $set: { is_verified: true }, $unset: { verify_token: "", active: "" } })
        .then(_ => openSession(user._id))
        .then(token => setSessionCookie(ctx, token))
        .then(_ => ctx.json({msg: "Email verified"}))
        .then(_ => ctx.redirect("/?verified=true"));
}

export async function login(ctx: Context) {
    
    const body = validateData(await ctx.req.json(), TLogin);
    if ( !body.ok ) {
        return throwError(ctx, 400, body.error);
    }

    const { email, password } = body.data;

    const user = await db
        .collection<IUser>("users")
        .findOne<WithId<IUser>>({ email });

    if ( user === null ) {
        return throwError(ctx, 400, "User does not exist");
    } 
    if ( !user.is_verified ) {
        return throwError(ctx, 400, "Email is not verified");
    }

    const match = await bcrypt.compare(password, user.password);
    if ( !match ) {
        return throwError(ctx, 400, "Invalid password");
    }

    const next_cipher = Math.max(...Object.keys(user.solved || {0: 0}).map(Number));

    return openSession(user._id)
        .then(token => setSessionCookie(ctx, token))
        .then(_ => setNext(ctx, next_cipher + 1))
        .then(_ => ctx.json({msg: "Logged in"}))
}

export async function logout(ctx: Context) {
    const session_token = getCookie(ctx, "session") || "";
    
    await db.collection<ISession>("sessions")
        .deleteMany({ token: session_token });

    return weakLogout(ctx);
}

export async function weakLogout(ctx: Context) {
    deleteCookie(ctx, "session");
    deleteCookie(ctx, "isauth");
    return ctx.json({ msg: "Logged out"});
}

async function openSession(user_id: ObjectId): Promise<string> {
    const sessionToken: string = uuidv4();

    return db
        .collection<ISession>("sessions")
        .updateOne(
            { user_id },
            { $set: {
                token: sessionToken,
                expiry: new Date(Date.now() + MAX_AGE * 1000)
            }},
            { upsert: true })
        .then(_ => sessionToken);
}

export async function checkSession(token: string): Promise<Result<ObjectId, string>> {
    return db
        .collection<ISession>("sessions")
        .findOne({
            token: token,
            expiry: { $gt: new Date() }
        })
        .then(value => {
            if (value === null) {
                return Err("Invalid or expired token")
            } else {
                return Ok(value.user_id)
            }
        });
} 

function setSessionCookie(ctx: Context, token: string) {
    setCookie(ctx, "session", token, {
        path: "/",
        secure: true,
        httpOnly: true,
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        sameSite: "Strict"
    });
    setCookie(ctx, "isauth", "true", {
        path: "/",
        secure: true,
        httpOnly: false,
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        sameSite: "Strict"
    });
}

export async function auth(ctx: Context, next: Next) {
    const session_token = getCookie(ctx, "session");
    const session = await checkSession(session_token || "");
    if ( !session.ok )
        return throwError(ctx, 401, session.error);

    const user_id = session.data;

    const users = db.collection<IUser>("users");
    const user = await users.findOne({ _id: user_id });

    if ( !user )
        return throwError(ctx, 404, "User does not exist");

    ctx.set("user", user);
    return next();
}

export async function requestReset(ctx: Context) {
    
    const body = validateData(await ctx.req.json(), TRqReset);
    if ( !body.ok ) { 
        return throwError(ctx, 400, body.error);
    } 

    const { email } = body.data;

    const users = db.collection<IUser>("users");
    const sessions = db.collection<ISession>("sessions");

    const user = await users.findOne({ email });
    if ( !user ) {
        return throwError(ctx, 400, "User not found");
    }

    const resetToken = uuidv4();
    const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;
     
    transporter.sendMail({
        from: MAIL_USER,
        to: email,
        subject: "Reset your password",
        text: `Click to reset: ${resetUrl}`,
    });

    return users
        .updateOne({ _id: user._id },
            {
                $set: { resetToken, active: new Date(Date.now() + MAX_AGE * 1000) }
            })
        .then(_ => sessions.deleteOne({user_id: user._id}))
        .then(_ => ctx.json({msg: "Password reset token sent"}));
}

export async function resetPassword(ctx: Context) {

    const body = validateData(await ctx.req.json(), TReset);
    if ( !body.ok ) {
        return throwError(ctx, 400, body.error);
    }

    const { token, password } = body.data;

    const users = db.collection<IUser>("users");
    const sessions = db.collection<ISession>("sessions");
    
    const user = await users.findOne({ resetToken: token, active: { $gte: new Date() }});
    if ( !user ) {
        return throwError(ctx, 400, "Invalid or expired token");
    }

    const hashed = bcrypt.hash(password, 10);
    return users
        .updateOne(
            { _id: user._id },
            { 
                $set: { password: await hashed },
                $unset: { reset_token: "", active: "" }
            })
        .then(_ => sessions.deleteOne({user_id: user._id}))
        .then(_ => ctx.json({msg: "Password reset successful"}));
}

