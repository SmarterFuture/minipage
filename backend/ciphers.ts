import type { Context } from "hono";
import type { IUser } from "./types";
import { checkSession } from "./auth";
import { db } from "./setup";
import type { ICipher } from "./types/db";
import { getCookie, setCookie } from "hono/cookie";
import { puzzlePage, puzzlePageLast } from "../views";


export async function setNext(ctx: Context, id: number) {
    setCookie(ctx, "tonext", id.toString(), {
        path: "/",
        secure: true,
        httpOnly: false,
        sameSite: "Strict"
    })
}

export async function getCipher(ctx: Context, id: number, pass: string | null, next = false) {
    const token = getCookie(ctx, "session");
    const session = await checkSession(token || "" );
     
    let guest; 
    let user_id;
    if (!session.ok) {
        guest = true;
    } else {
        guest = false;
        user_id = session.data;
    }
    
    const cipher = await db
        .collection<ICipher>("ciphers")
        .findOne({ cipher_id: id }) 
    
    if (!cipher) {
        return ctx.html(puzzlePageLast(id, next))
    }

    if (pass === null) {
        return ctx.html(puzzlePage(id, cipher.file.filename, ""))
    }
    const r_pass = pass.replaceAll(" ", "-");

    if (cipher.passkey !== r_pass) {
        return ctx.html(puzzlePage(id, cipher.file.filename, "", false, false))
    }
    
    if (!guest) {
        const obj_id = cipher.cipher_id.toString();
        const key = `solved.${obj_id}`;
        db.collection<IUser>("users")
            .updateOne(
                { _id: user_id, [key]: { $exists: false }},
                { $set: { [key]: new Date() }}
            )
    }
    await setNext(ctx, id + 1);
    return ctx.html(puzzlePage(id, cipher.file.filename, cipher.afterword, true))
}
