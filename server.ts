import { serveStatic } from "hono/bun";
import { Hono, type Context } from "hono";

import { auth, login, logout, register, requestReset, resetPassword, verifyEmail } from "./backend/auth";
import { getMessages, postMessage, threadResponse } from "./backend/chat";
import { getCipher } from "./backend/ciphers";
import { PORT } from "./backend/consts";
import { checkAccess } from "./backend/files";
import { discord_client } from "./backend/setup/discord";
import { chatsPage, homePage, loginPage, resetPage } from "./views";



const app = new Hono();

discord_client.on("messageCreate", threadResponse);


app.use("/static/*", serveStatic({ root: "./" }));
app.use("/js/*", serveStatic({ root: "./" }));

app.use("/filebin/:userid/:file{.+}", auth, checkAccess, serveStatic({ root: "./"}))

app.get("/", (c: Context) => {
    return c.html(homePage());
});

app.post("/register", register);
app.post("/login", login);
app.post("/logout", auth, logout);
app.post("/weak-logout", logout);

app.post("/request-reset", requestReset);
app.post("/reset-password", resetPassword);

app.get("/verify", (ctx: Context) => {
    const token = ctx.req.query("token") || "";
    return verifyEmail(ctx, token);
});

app.get("/chats", (ctx: Context) => ctx.html(chatsPage()));
app.get("/login", (ctx: Context) => ctx.html(loginPage()));
app.get("/register", (ctx: Context) => ctx.html(loginPage(true)));
app.get("/reset-password", (ctx: Context) => ctx.html(resetPage()));

app.post("/post-message", auth, postMessage);
app.post("/get-messages", auth, getMessages);

app.get("/:id_pass", (ctx: Context) => {
    const id_pass = ctx.req.param("id_pass");
    const [ id, pass ] = id_pass.split("-");

    const next = Boolean(ctx.req.query("next"));
    
    let cipher_id = Number(id);
    cipher_id = Number.isInteger(cipher_id) ? cipher_id : -1;

    const passkey = pass || null;

    return getCipher(ctx, cipher_id, passkey, next);
});

export default {
    port: PORT,
    fetch: app.fetch
}

