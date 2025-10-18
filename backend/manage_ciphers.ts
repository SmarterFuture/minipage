import { Attachment, SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import path from "node:path";
import fs from "fs/promises";

import { db, getNextSerial } from "./setup/db";
import type { ICipher, ICounter } from "./types/db";
import { STATIC_PATH } from "./consts";


export const slash_command = new SlashCommandBuilder()
    .setName("cipher")
    .setDescription("Put, remove, edit")
    .addSubcommand(sc => sc
        .setName("put")
        .setDescription("Put new cipher to the page")
        .addStringOption(o => o
            .setName("passkey")
            .setDescription("Key of the cipher")
            .setRequired(true)
        )
        .addAttachmentOption(o => o
            .setName("cipher")
            .setDescription("Cipher file to be displayed")
            .setRequired(true)
        )
        .addAttachmentOption(o => o
            .setName("talk")
            .setDescription("Behind the scene talk file [txt]")
            .setRequired(true)
    ))
    .addSubcommand(sc => sc
        .setName("remove")
        .setDescription("Removes cipher and reindex other")
        .addNumberOption(o => o
            .setName("id")
            .setDescription("cipher id")
            .setRequired(true)
    ))
    .addSubcommand(sc => sc
        .setName("edit")
        .setDescription("edits cipher")
        .addNumberOption(o => o
            .setName("id")
            .setDescription("cipher id")
            .setRequired(true)
        )
        .addStringOption(o => o
            .setName("passkey")
            .setDescription("Key of the cipher")
        )
        .addAttachmentOption(o => o
            .setName("cipher")
            .setDescription("Cipher file to be displayed")
        )
        .addAttachmentOption(o => o
            .setName("talk")
            .setDescription("Behind the scene talk file [txt]")
    ))


export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand: string = interaction.options.getSubcommand();

    if (subcommand === "put" ) {
        const passkey = interaction.options.getString("passkey");
        const cipher = interaction.options.getAttachment("cipher");
        const talk = interaction.options.getAttachment("talk");

        if (!passkey || !cipher || !talk) {
            interaction.reply("Invalid attachments")
            return
        }

        await putCipher(passkey, cipher, talk)
            .catch(e => Promise.reject(e));
    }

    else if (subcommand === "edit") {
        const id = interaction.options.getNumber("id");
        const passkey = interaction.options.getString("passkey");
        const cipher = interaction.options.getAttachment("cipher");
        const talk = interaction.options.getAttachment("talk");
        
        if (!id && id !== 0) {
            interaction.reply("Invalid id");
            return
        }

        await editCipher(id, passkey, cipher, talk)
            .catch(e => Promise.reject(e));
    }

    else if (subcommand === "remove") {
        const id = interaction.options.getNumber("id");

        if (!id || id === 0) {
            interaction.reply("Invalid id");
            return
        }
        
        await removeCipher(id)
            .catch(e => Promise.reject(e));
    }

    interaction.reply("Done");

} 


async function putCipher(passkey: string, cipher: Attachment, talk: Attachment) {
    
    if (!talk.contentType || !talk.contentType.startsWith("text/plain")) {
        throw Error("Invalid filetype for talk");
    }

    const fp = path.join(STATIC_PATH, cipher.name);

    fetch(cipher.url)
        .then(res => res.arrayBuffer())
        .then(a_buf => Buffer.from(a_buf))
        .then(buf => fs.writeFile(fp, buf))

    const r_talk = await fetch(talk.url)
        .then(f => f.text());
    const id = await getNextSerial();

    const r_key = passkey.replaceAll(" ", "_");

    return db.collection<ICipher>("ciphers")
        .insertOne({
            cipher_id: id,
            passkey: r_key,
            afterword: r_talk,
            file: {
                mimetype: cipher.contentType,
                filename: cipher.name,
                path: fp
            }
        } as ICipher)
}

async function editCipher(id: number, passkey: String | null, cipher: Attachment | null, talk: Attachment | null) {
    const update: any = {};

    if (passkey) {
        update.passkey = passkey.replaceAll(" ", "_");
    }
    
    if (cipher) {
        const fp = path.join(STATIC_PATH, cipher.name);
        fetch(cipher.url)
            .then(res => res.arrayBuffer())
            .then(a_buf => Buffer.from(a_buf))
            .then(buf => fs.writeFile(fp, buf))

        update.file = {
            mimetype: cipher.contentType,
            filename: cipher.name,
            path: fp
        }
    }

    if (talk) {
        if (!talk.contentType || !talk.contentType.startsWith("text/plain")) {
            throw Error("Invalid filetype for talk");
        }
        
        update.afterword = await fetch(talk.url)
            .then(f => f.text());
    }

    return db.collection<ICipher>("ciphers")
        .updateOne({ cipher_id: id }, { $set: update })
}

async function removeCipher(id: number) {
    
    await db.collection<ICipher>("ciphers")
        .deleteOne({ cipher_id: id})
    
    await db.collection<ICipher>("ciphers")
        .updateMany(
            { cipher_id: { $gt: id }},
            { $inc: { cipher_id: -1 }}
        )
    
    await db.collection<ICounter>("ciphers")
        .updateOne(
            { _id: "serial" },
            { $inc: { seq: -1 }}
        )
}
