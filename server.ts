import { serveStatic } from "hono/bun";
import { Hono, type Context } from "hono";

import { homePage } from "./views/home";
import { puzzlePage, puzzlePageLast } from "./views/puzzle";

import { auth, login, register, requestReset, resetPassword, verifyEmail } from "./backend/auth";
import { getMessages, postMessage, threadResponse } from "./backend/chat";
import { discord_client } from "./backend/discord_setup";
import { PORT } from "./backend/consts";
import { checkAccess } from "./backend/files";
import { files, keys, talk } from "./secret";


const app = new Hono();

discord_client.on("messageCreate", threadResponse);


app.use("/static/*", serveStatic({ root: "./" }));

app.use("/filebin/:userid/:file{.+}", auth, checkAccess, serveStatic({ root: "./"}))

app.get("/", (c: Context) => {
    const message = c.req.query("message");
    const html = message ? `<p class="message">${message}</p>` : "";
    return c.html(homePage(html));
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

app.get("/:idKey", (c: Context) => {
    const idKey = c.req.param("idKey");
    const [idStr, key] = idKey.split("-");
    const id = parseInt(idStr || "", 10);

    if (Number.isNaN(id) || !keys[id]) {
        return c.redirect("/?message=Invalid ID");
    }

    if (keys[id] === key) {
        if ( files[id] == undefined ) {
            return c.html(puzzlePageLast(id, talk[id]));
        } else {
            return c.html(puzzlePage(id, files[id], talk[id]));
        }
    } else {
        return c.redirect(`/?message=This is not the key for ${id}`);
    }
});

export default {
    port: PORT,
    fetch: app.fetch
}

