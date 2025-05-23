import { AutocompleteInteraction } from 'discord.js';
import { commands } from '../server';

export default async function autocompleteHandler(interaction: AutocompleteInteraction) {
    if (!interaction.isAutocomplete()) return;

    const command = commands.get(interaction.commandName);
    if (command && command.autocomplete) await command.autocomplete(interaction);
}
