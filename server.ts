import { serveStatic } from "hono/bun";
import { Hono, type Context } from "hono";

import { homePage } from "./views/home";

import { auth, login, register, requestReset, resetPassword, verifyEmail } from "./backend/auth";
import { getMessages, postMessage, threadResponse } from "./backend/chat";
import { discord_client } from "./backend/setup/discord";
import { PORT } from "./backend/consts";
import { checkAccess } from "./backend/files";
import { getCipher } from "./backend/ciphers";


const app = new Hono();

discord_client.on("messageCreate", threadResponse);


app.use("/static/*", serveStatic({ root: "./" }));

app.use("/filebin/:userid/:file{.+}", auth, checkAccess, serveStatic({ root: "./"}))

app.get("/", (c: Context) => {
    return c.html(homePage());
});

app.post("/register", register);
app.post("/login", login);
app.get("/verify", (ctx) => {
    const token = ctx.req.query("token") || "";
    return verifyEmail(ctx, token);
});
app.get("/requestReset", requestReset);
app.get("/resetPassword", (ctx) => {
    const token = ctx.req.query("token") || "";
    return resetPassword(ctx, token);
});

app.post("/postMessage", auth, postMessage);
app.post("/getMessages", auth, getMessages);

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

