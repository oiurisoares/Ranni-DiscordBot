import { Client, GatewayIntentBits } from 'discord.js';

/**
 * Discord client configuration.
 * This client is used to interact with the Discord API.
 */
const discord = new Client({
    intents: [GatewayIntentBits.Guilds],
});

export default discord;
