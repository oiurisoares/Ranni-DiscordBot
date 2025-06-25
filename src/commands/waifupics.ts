import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';
import axiosInstance from '../config/axios';
import categories from '../assets/waifupics.categories.json';

export default {

    /**
     * The waifupics command definition.
     * This command allows users to fetch and send random waifu pictures.
     * --
     * @type {import('discord.js').SlashCommandBuilder}
     * @property {boolean} nsfw - Indicates whether the command is NSFW.
     * @property {string} amount - Specifies the number of images to send.
     * @property {string} category - The category of waifu pictures to fetch.
     */
    data: new SlashCommandBuilder()
        .addBooleanOption((option) => {
            return option
                .setDescription('Enable NSFW content for this command📍')
                .setDescriptionLocalizations({
                    'pt-BR': 'Ativar conteúdo NSFW para este comando📍',
                })
                .setName('nsfw')
                .setRequired(true);
        })
        .addStringOption((option) => {
            return option
                .addChoices(
                    { name: 'many', value: 'many' },
                    { name: 'single', value: 'single' },
                )
                .setDescription('Specify the amount of images to send📍')
                .setDescriptionLocalizations({
                    'pt-BR': 'Especifica a quantidade de imagens a serem enviadas📍',
                })
                .setName('amount')
                .setRequired(true);
        })
        .addStringOption((option) => {
            return option
                .setAutocomplete(true)
                .setDescription('Select a category of waifu pictures📍')
                .setDescriptionLocalizations({
                    'pt-BR': 'Selecione uma categoria de imagens de waifu📍',
                })
                .setName('category')
                .setRequired(false);
        })
        .setDescription('💖Send a random waifu picture!')
        .setDescriptionLocalizations({
            'pt-BR': '💖Envie uma imagem aleatória de waifu!',
        })
        .setName('waifupics')
        .setNSFW(true),

    /**
     * Autocomplete handler for the waifupics command.
     * This function provides category suggestions based on user input.
     * --
     * @param interaction The autocomplete interaction object.
     * @returns {Promise<void>}
     * @throws {Error} If an error occurs while processing the autocomplete.
     */
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name !== 'category') return;

        const nsfw = interaction.options.getBoolean('nsfw') ?? false;
        const categoryList = nsfw ? categories.NSFW : categories.SFW;

        const options = Object.entries(categoryList as Record<string, string>)
            .filter(([key, value]) => {
                return key.toLowerCase()
                    .includes(focusedOption.value.toLowerCase())
                    || value.toLowerCase()
                        .includes(focusedOption.value.toLowerCase());
            })
            .slice(0, 25)
            .map(([key, value]) => {
                return {
                    name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
                    value,
                };
            });
        await interaction.respond(options);
    },

    /**
     * Executes the waifupics command.
     * This command fetches and sends a random waifu picture based on the specified
     * options.
     * --
     * @param interaction The interaction object for the command.
     * @returns {Promise<void>}
     * @throws {Error} If an error occurs while fetching waifu pictures.
     */
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: 'This command can only be used in a server.',
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
        if (interaction.channel instanceof TextChannel
            && interaction.channel.nsfw) {
            const nsfw = interaction.options.getBoolean('nsfw', false);
            if (!nsfw) {
                await interaction.reply({
                    content: 'This command cannot be used in a non-NSFW channel.',
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }
        }

        const amount = interaction.options.getString('amount', true);
        const type = interaction.options.getBoolean('nsfw', true) ? 'nsfw' : 'sfw';
        const category = interaction.options.getString('category', true);
        if (!category) {
            await interaction.reply({
                content: 'Please select a valid category.',
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
        interaction.deferReply();
        try {
            if (amount === 'many') {
                const response = await axiosInstance
                    .post<any>(
                        `https://api.waifu.pics/many/${type}/${category}`,
                        {},
                    );
                await Promise.all(response.data.files.map((url: string) => {
                    return interaction.followUp({
                        content: url,
                    });
                }));
            } else {
                const response = await axiosInstance
                    .get<any>(`https://api.waifu.pics/${type}/${category}`);
                await interaction.editReply({
                    files: [response.data.url],
                });
            }
        } catch (error: any) {
            console.error('Error executing waifupics command:', error);
            await interaction.editReply({
                content: 'An error occurred while fetching waifu pictures.',
            });
        }
    },
};
