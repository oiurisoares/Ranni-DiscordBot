import { Client, GatewayIntentBits } from 'discord.js';

/**
 * Discord client configuration.
 * This client is used to interact with the Discord API.
 * --
 * @type {Client}
 * @property {GatewayIntentBits[]} intents - The intents that the client will use.
 */
const discord = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

export default discord;
