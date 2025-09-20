import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import prisma from '../config/prisma';
import { Guild } from '../models/Guild';

export default {

    /**
     * Creates a new guild entry in the database.
     * This function attempts to create a new guild with the provided guildId.
     * If a guild with the same Id already exists, it will throw an error.
     * --
     * @param params - guildId: string
     * @returns {Promise<Guild | null>} - The created guild or null if creation failed.
     * @throws Error if there is an issue with the database query.
     */
    create: async (params: { guildId: string }): Promise<Guild | null> => {
        try {
            return await prisma.guild.create({
                data: {
                    id: params.guildId,
                    isBlacklisted: false,
                    isPremium: false,
                },
            });
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('Prisma error creating Guild:');
                throw new Error(error.message);
            }
            console.error('Unexpected error while creating Guild:');
            throw new Error(error);
        }
    },

    /**
     * Retrieves a list of guilds.
     * This function fetches all guilds from the database.
     * If there are no guilds, it returns an empty array.
     * --
     * @returns {Promise<Guild[]>} - Resolves to an array of guilds.
     * @throws Error if there is an issue with the database query.
     */
    getAll: async (): Promise<Guild[]> => {
        try {
            return await prisma.guild.findMany();
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('Prisma error getting all Guilds:');
                throw new Error(error.message);
            }
            console.error('Unexpected error while getting all Guilds:');
            throw new Error(error);
        }
    },

    /**
     * Retrieves the default channel for a guild.
     * This function fetches the default channel Id for a given guild.
     * If the guild does not exist or has no default channel set, it returns null.
     * --
     * @param guildId - The discord Id of the guild.
     * @returns {Promise<string | null>} - Resolves to the default channel Id, or null.
     * @throws Error if there is an issue with the database query.
     */
    getDefaultChannel: async (params: { guildId: string }): Promise<string | null> => {
        try {
            return await prisma.guild.findUnique({
                select: {
                    defaultChannel: true,
                },
                where: {
                    id: params.guildId,
                },
            }).then((guild) => {
                if (!guild) return null;
                return guild.defaultChannel;
            });
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('Prisma error getting Guild\'s default Channel:');
                throw new Error(error.message);
            }
            console.error('Unexpected error while getting Guild\'s default Channel:');
            throw new Error(error);
        }
    },

    /**
     * Retrieves the member count for a guild.
     * This function counts the number of members in a guild by its Id.
     * If the guild does not exist, it returns 0.
     * --
     * @param countBlacklisted - Whether to include blacklisted guilds in the count.
     * @param guildId - The discord Id of the guild.
     * @returns {Promise<number>} - Resolves to the number of members in the guild.
     * @throws Error if there is an issue with the database query.
     */
    getMemberCount: async (params: {
        countBlacklisted?: boolean,
        guildId: string
    }):
        Promise<number> => {
        try {
            return await prisma.guild.count({
                where: {
                    id: params.guildId,
                    ...(!params.countBlacklisted ? {} : {
                        isBlacklisted: false,
                    }),
                },
            });
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('Prisma error getting guild members count:');
                throw new Error(error.message);
            }
            console.error('Unexpected error while getting guild members count:');
            throw new Error(error);
        }
    },

    /**
     * Sets the default channel for a guild.
     * This function updates or creates a guild with a specified default channel.
     * If the guild does not exist, it will create a new entry with the provided channel
     * --
     * @param channelId - The discord Id of the channel.
     * @param guildId - The discord Id of the guild.
     * @returns {Promise<void>} - Resolves when the channel is set.
     * @throws Error if there is an issue with the database query.
     */
    setDefaultChannel: async (params: { guildId: string, channelId: string }):
        Promise<void> => {
        try {
            await prisma.guild.upsert({
                create: {
                    id: params.guildId,
                    defaultChannel: params.channelId,
                },
                update: {
                    defaultChannel: params.channelId,
                },
                where: {
                    id: params.guildId,
                },
            });
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('Prisma error setting Guild\'s default Channel:');
                throw new Error(error.message);
            }
            console.error('Unexpected error while setting Guild\'s default Channel:');
            throw new Error(error);
        }
    },
};
