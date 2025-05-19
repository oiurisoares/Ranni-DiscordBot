import { Client, GatewayIntentBits } from 'discord.js';

const discord = new Client({
    intents: [GatewayIntentBits.Guilds],
});

export default discord;
