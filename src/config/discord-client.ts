import { Client, GatewayIntentBits } from 'discord.js';

const discord = (): Client => new Client({
    intents: [GatewayIntentBits.Guilds],
});

export default discord;
