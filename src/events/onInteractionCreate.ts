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
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isCommand()) return;

        const command = commands.get(interaction.commandName);
        if (!command) {
            await interaction.reply({
                content: 'Command not found.',
                ephemeral: true,
            });
            return;
        }
        try {
            if (interaction.isAutocomplete()) {
                await autocompleteHandler(interaction);
            }
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
