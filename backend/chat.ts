import { ChannelType, Client, Message, TextChannel, ThreadChannel, type AnyThreadChannel } from "discord.js";
import type { Context } from "hono";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

import { TMessage, TView, validateData, type IFile, type IMessages, type IUser } from "./types";
import { throwError } from "./funcs";
import { db, discord_client } from "./setup";
import { DISCORD_CHANNEL_ID, FS_PATH, HOME_PATH } from "./consts";
import { formDataToObject } from "./types/common";


function checkFileType(mimetype: string): boolean {
    if ( mimetype === "application/pdf" || mimetype.startsWith("image/")) {
        return true
    }
    return false 
}

async function getThread(client: Client, thread_id?: string, name?: string):
    Promise<AnyThreadChannel> {
    
    const r_channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
    if ( !r_channel || !r_channel.isTextBased() ) {
        throw Error(`Channel ${DISCORD_CHANNEL_ID} not found`)
    }

    const channel = r_channel as TextChannel;

    return channel
        .threads
        .fetch(thread_id || "")
        .then(t => {
            if ( t?.id !== undefined && t !== null ) {
                return t
            }
            return channel.threads.create({
                name: name || "Conversation",
                type: ChannelType.PublicThread
            })
        })
        .then(t => {
            t.setArchived(false);
            t.edit({ locked: false })
            return t
        })
}

/**
    * This is web-page function
*/
export async function postMessage(ctx: Context) {
    
    const body = validateData(formDataToObject(await ctx.req.formData()), TMessage);
    if ( !body.ok ) {
        return throwError(ctx, 400, body.error);
    }

    const user = ctx.get("user");
    const { text, file } = body.data;
    
    let uploads: Array<IFile> = [];
    let file_res: string;
    let files: Array<string> = [];

    if (!file) {
        file_res = "No file uploaded";
    } else if ( file.size === 5242880) {
        file_res = `Ignoring ${file.name} - file too big`
    } else if ( !checkFileType(file.type) ) {
        file_res = `Ignoring ${file.name} - invalid type`
    } else {
       
        const handle = uuidv4() + path.extname(file.name);

        const dirpath = path.join(FS_PATH, user._id.toString());
        const filepath = path.join(dirpath, handle);
        const r_fp = path.join(HOME_PATH, filepath);
        
        await fs.mkdir(path.join(HOME_PATH, dirpath), { recursive: true })

        file.arrayBuffer()
            .then(a_buf => Buffer.from(a_buf))
            .then(buf => fs.writeFile(r_fp, buf));

        uploads.push({
            mimetype: file.type,
            filename: file.name,
            path: filepath
        } as IFile);

        file_res = `File ${file.name} uploaded as ${filepath}`
        files.push(r_fp);
    }

    db.collection<IMessages>("messages").insertOne({
        user_id: user._id,
        who: "you",
        created: new Date(),
        text,
        attachment: uploads
    } as IMessages);

    const thread = await getThread(discord_client, user.thread_id, user.email);

    db.collection<IUser>("users")
        .updateOne({ _id: user._id}, {
            $set: { thread_id: thread.id }
        })

    return thread
        .send({
            content: text,
            files
        })
        .then(_ => ctx.json({msg: "Post succesfully created", file_res}))
        .catch(e => throwError(ctx, 500, e));
}

/**
    * This is Discord end function
*/
export async function threadResponse(msg: Message) {
    if ( msg.author.bot ) return;
    
    const channel = msg.channel;
    if ( !channel.isThread ) return;

    const thread = channel as ThreadChannel
    if ( thread.parentId !== DISCORD_CHANNEL_ID) return;
    
    const user = await db.collection<IUser>("users").findOne({ thread_id: thread.id });
    if ( !user ) {
        await msg.reply("No user linked to this thread");
        return;
    }

    const all_files = msg.attachments.values().map(async file => {
        const handle = uuidv4() + path.extname(file.name);

        const dirpath = path.join(FS_PATH, user._id.toString());
        const filepath = path.join(dirpath, handle);
        const r_fp = path.join(HOME_PATH, filepath);
        
        if ( !checkFileType(file.contentType || "") ) { 
            msg.reply(`Ignoring \`${file.name}\` - invalid type`);
            return 
        }   

        await fs.mkdir(path.join(HOME_PATH, dirpath), { recursive: true });

        return fetch(file.url)
            .then(res => res.arrayBuffer())
            .then(a_buf => Buffer.from(a_buf))
            .then(buf => fs.writeFile(r_fp, buf))
            .then(_ => { return {
                filename: file.name,
                mimetype: file.contentType,
                path: filepath
            } as IFile })
    })

    db.collection<IMessages>("messages")
        .insertOne({
            user_id: user._id,
            who: "admin",
            created: new Date(),
            text: msg.content,
            attachment: (await Promise.all(all_files)).filter(Boolean)
        } as IMessages);

    msg.react("👍");
}

export async function getMessages(ctx: Context) {

    const body = validateData(await ctx.req.json(), TView);
    if ( !body.ok ) {
        return throwError(ctx, 400, body.error);
    }

    const user_id = ctx.get("user")._id;
    const { start, end } = body.data;

    return db
        .collection<IMessages>("messages")
        .find({ user_id })
        .sort({ created: -1 })
        .project({
            who: 1,
            text: 1,
            created: 1,
            attachment: 1,
        })
        .toArray()
        .then(v => ctx.json({msgs: v.slice(start, end)}));
}
