import { Client, REST, Routes } from "discord.js";
import { DISCORD_CLIENT_ID, DISCORD_TOKEN } from "../consts";

import * as cipher from "../manage_ciphers.ts";

export const discord_client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

discord_client.once("clientReady", async () => {
    console.log("Connected to discord bot");

    await deployCommands();
})

discord_client.login(DISCORD_TOKEN);

const commands = {
    cipher
}

const commandsData = Object.values(commands).map((command) => command.slash_command);

const rest = new REST().setToken(DISCORD_TOKEN);

discord_client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands]
            .execute(interaction)
            .catch( e => interaction.reply(`Something went wrong *(${e})*`));
    }
});

export async function deployCommands() {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationCommands(DISCORD_CLIENT_ID),
            {
                body: commandsData,
            });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}

