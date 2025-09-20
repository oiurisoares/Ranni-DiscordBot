import { Events, Guild } from 'discord.js';
import guildService from '../services/guildService';

export default {
    name: Events.GuildCreate,
    once: false,

    /**
     * Handles the GuildCreate event.
     * This function is triggered when the bot joins a new guild.
     * --
     * @param guild - The guild that was created.
     * @returns {Promise<void>} - Resolves when the guild has been processed.
     * @throws Error if there is an issue processing the guild.
     */
    async execute(guild: Guild) {
        try {
            await guildService.create({ guildId: guild.id });
        } catch (error: any) {
            console.error('Error handling GuildCreate event:', error);
        }
    },
};
