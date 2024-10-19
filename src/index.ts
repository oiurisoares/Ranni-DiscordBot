import dotenv from 'dotenv';
import discord from './config/discord-client';
import loadEvents from './events';

dotenv.config();

const client = discord();
loadEvents(client);

client.login(process.env.TOKEN).catch((error) => {
    console.error('Failed to login: ', error);
});
