import {
    ActivityType, Client, Events, PresenceUpdateStatus,
} from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log(`Logged in as ${client.user?.tag}`);

        client.user?.setPresence({
            activities: [
                {
                    name: 'You',
                    type: ActivityType.Watching,
                },
            ],
            status: PresenceUpdateStatus.Online,
        });
    },
};
