import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import prisma from '../config/prisma';
import { Guild } from '../models/Guild';

export default {

    /**
     * Retrieves a list of guilds.
     * --
     * @returns {Promise<Guild[]>} - Resolves to an array of guilds.
     */
    getAll: async (): Promise<Guild[]> => {
        try {
            return await prisma.guild.findMany();
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    /**
     * Retrieves the default channel for a guild.
     * --
     * @param guildId - The discord Id of the guild.
     * @returns {Promise<string | null>} - Resolves to the default channel Id, or null.
     */
    getDefaultChannel: async (guildId: string): Promise<string | null> => {
        try {
            return await prisma.guild.findUnique({
                select: {
                    defaultChannel: true,
                },
                where: {
                    id: guildId,
                },
            }).then((guild) => {
                if (guild) {
                    return guild.defaultChannel;
                }
                return null;
            });
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    /**
     * Retrieves the member count for a guild.
     * --
     * @param guildId - The discord Id of the guild.
     * @returns {Promise<number>} - Resolves to the number of members in the guild.
     */
    getMemberCount: async (guildId: string): Promise<number> => {
        try {
            return await prisma.guild.count({
                where: {
                    id: guildId,
                },
            });
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    /**
     * Sets the default channel for a guild.
     * --
     * @param channelId - The discord Id of the channel.
     * @param guildId - The discord Id of the guild.
     * @returns {Promise<void>} - Resolves when the channel is set.
     */
    setDefaultChannel: async (guildId: string, channelId: string): Promise<void> => {
        try {
            await prisma.guild.upsert({
                create: {
                    id: guildId,
                    defaultChannel: channelId,
                },
                update: {
                    defaultChannel: channelId,
                },
                where: {
                    id: guildId,
                },
            });
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },
};
