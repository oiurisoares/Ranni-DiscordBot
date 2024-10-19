import { Client } from 'discord.js';
import fileSystem from 'fs';
import { join } from 'path';

const loadEvents = async (client: Client) => {
    const eventsPath = join(__dirname);
    const eventsFile = fileSystem.readdirSync(eventsPath)
        .filter((file) => file.endsWith('.ts'));

    eventsFile.forEach(async (file) => {
        if (file === 'index.ts') return;

        const event = await import(join(eventsPath, file));
        if (event.default.once) {
            client.once(
                event.default.name,
                (...args) => event.default.execute(...args, client),
            );
        } else {
            client.on(
                event.default.name,
                (...args) => event.default.execute(...args, client),
            );
        }
    });
};

export default loadEvents;
