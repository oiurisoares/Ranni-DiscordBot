import chalk from 'chalk';
import {
    ActivityType, Client, Events, PresenceUpdateStatus,
} from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,

    /**
     * Handles the client ready event.
     * This event is triggered when the client has successfully logged in and is ready
     * to start receiving events.
     */
    async execute(client: Client) {
        console.info(chalk
            .whiteBright(`\nLogged in as ${client.user?.tag}\n`));

        const statusList: string[] = [
            '📜 Estudando as estrelas em busca de segredos antigos',
            '🕯️ Sussurrando pactos que selam destinos',
        ];
        setInterval(() => {
            client.user?.setPresence({
                activities: [
                    {
                        name: 'Ranni The Witch',
                        state: statusList[Math.floor(Math.random() * statusList.length)],
                        type: ActivityType.Custom,
                    },
                ],
                status: PresenceUpdateStatus.Online,
            });
        }, 30 * 1000);
    },
};
