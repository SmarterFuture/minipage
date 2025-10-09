import { Client } from "discord.js";
import { DISCORD_TOKEN } from "../consts";


export const discord_client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

discord_client.once("clientReady", async () => {
    console.log("Connected to discord bot")
})

discord_client.login(DISCORD_TOKEN);
