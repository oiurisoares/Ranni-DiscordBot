import { AutocompleteInteraction } from 'discord.js';
import { commands } from '../server';

/**
 * Handles autocomplete interactions for commands.
 * This function checks if the interaction is an autocomplete interaction,
 * --
 * @param interaction The autocomplete interaction object.
 * This function handles autocomplete interactions for commands.
 * @returns
 */
export default async function autocompleteHandler(interaction: AutocompleteInteraction) {
    if (!interaction.isAutocomplete()) return;

    const command = commands.get(interaction.commandName);
    if (command && command.autocomplete) await command.autocomplete(interaction);
}
