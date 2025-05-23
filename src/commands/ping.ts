import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .addBooleanOption((option) => {
            return option
                .setDescription('Retrieves ping detailed information📍')
                .setName('detail')
                .setRequired(false);
        })
        .setDescription('🏓Replies with pong!')
        .setName('ping')
        .setNSFW(false),

    async execute(interaction: ChatInputCommandInteraction) {
        const start = process.hrtime();
        await interaction.deferReply();

        const diff = process.hrtime(start);
        const elapsedTime = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);
        const { ping } = interaction.client.ws;

        const embed = new EmbedBuilder()
            .setColor('#0D80C3')
            .setTitle('🏓 Pong!');

        if (interaction.options.getBoolean('detail')) {
            embed.setDescription(`
                🧠 Response time: \`\`${elapsedTime}\`\`
                🌐 Latency: \`\`${ping}\`\``)
                .setThumbnail(interaction.client.user?.displayAvatarURL());
        }
        try {
            await interaction.editReply({
                embeds: [embed],
            });
        } catch (error: any) {
            await interaction.editReply({
                content: 'Error executing the command.',
            });
            console.error('An error occurred: ', error);
        }
    },
};
