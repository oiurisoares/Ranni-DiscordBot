import {
    ChatInputCommandInteraction,
    Events,
    MessageFlags,
} from 'discord.js';
import { commands } from '../server';
import autocompleteHandler from '../handlers/autocompleteHandler';

export default {
    name: Events.InteractionCreate,
    once: false,

    /**
     * Handles interaction events in the Discord server.
     * This event is triggered when a user interacts with a command in the server.
     * --
     * @param interaction The interaction object for the command.
     * @returns {Promise<void>}
     * @throws {Error} If an error occurs while executing the command.
     */
    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.isAutocomplete()) {
            await autocompleteHandler(interaction);
        }
        if (!interaction.isCommand()) return;

        const command = commands.get(interaction.commandName);
        if (!command) {
            await interaction.reply({
                content: 'Command not found.',
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
        try {
            if (interaction.isChatInputCommand()) {
                await command.execute(interaction);
            }
        } catch (error: any) {
            console.error('An error occurred while executing the command:', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: 'Error occurred executing the command.',
                });
            } else {
                await interaction.reply({
                    content: 'Error occurred executing the command.',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
};
