import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log(`Logged in as ${client.user?.tag}`))
    .catch((error) => {
        console.error('Failed to log in:', error);
    });
