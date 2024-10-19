import { Client, Events } from 'discord.js';

const ready = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client): Promise<void> {
        console.log(`Client ready! Logged in as ${client.user?.tag}`);
    },
};

export default ready;
