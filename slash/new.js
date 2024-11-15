const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageSelectMenu } = require('discord.js');
const client = require("../index");
const pinnacleData = new Map(); // Temporary in-memory storage for weekly progress

module.exports = {
    name: 'new',
    description: 'Track weekly Pinnacle sources and update progress',
    options: [
        {
            name: 'view',
            description: 'View your weekly pinnacle progress',
            type: 'SUB_COMMAND'
        }
    ],
    run: async (client, interaction) => {
        const userId = interaction.user.id;

        if (interaction.options.getSubcommand() === 'view') {
            // Check if user already has progress data, if not, initialize
            if (!pinnacleData.has(userId)) {
                pinnacleData.set(userId, { character: 'All', sources: initializePinnacleSources() });
            }

            const userPinnacleProgress = pinnacleData.get(userId);

            // Create the embed for displaying pinnacle progress
            const embed = new MessageEmbed()
                .setTitle(`${interaction.user.username}'s Pinnacle Progress`)
                .setColor('#D4AF37')
                .setDescription('Track your pinnacle sources below:')
                .addFields(
                    userPinnacleProgress.sources.map(source => ({
                        name: source.name,
                        value: source.completed ? '✅ Completed' : '❌ Not Completed',
                        inline: true
                    }))
                );

            // Button to open the update modal
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('updatePinnacle')
                        .setLabel('Update Progress')
                        .setStyle('PRIMARY')
                );

            await interaction.followUp({ embeds: [embed], components: [row], ephemeral: true });
        }
    }
};

// Function to initialize pinnacle sources
function initializePinnacleSources() {
    return [
        { name: 'Nightfall 100k', completed: false },
        { name: 'Crucible Matches', completed: false },
        { name: 'Gambit Matches', completed: false },
        { name: 'Raid Completion', completed: false },
        { name: 'Dungeon Completion', completed: false },
        { name: 'Vanguard Ops', completed: false }
    ];
}

// Handle Button and Modal Interactions
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'updatePinnacle') {
            const modal = new Modal()
                .setCustomId('updatePinnacleModal')
                .setTitle('Update Your Pinnacle Progress');

            // Add a TextInputComponent for each source
            const sourceInputs = initializePinnacleSources().map(source => 
                new TextInputComponent()
                    .setCustomId(`source_${source.name}`)
                    .setLabel(`${source.name} Completed? (yes/no)`)
                    .setStyle('SHORT')
                    .setPlaceholder('yes or no')
                    .setRequired(true)
            );

            // Add each source input as a row
            sourceInputs.forEach(input => {
                const row = new MessageActionRow().addComponents(input);
                modal.addComponents(row);
            });

            await interaction.showModal(modal);
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'updatePinnacleModal') {
            const userId = interaction.user.id;
            const userPinnacleProgress = pinnacleData.get(userId) || { character: 'All', sources: initializePinnacleSources() };

            // Update user progress based on modal responses
            userPinnacleProgress.sources.forEach(source => {
                const response = interaction.fields.getTextInputValue(`source_${source.name}`).toLowerCase();
                source.completed = response === 'yes';
            });

            pinnacleData.set(userId, userPinnacleProgress);

            // Create an updated embed
            const embed = new MessageEmbed()
                .setTitle(`${interaction.user.username}'s Updated Pinnacle Progress`)
                .setColor('#D4AF37')
                .setDescription('Your pinnacle progress has been updated:')
                .addFields(
                    userPinnacleProgress.sources.map(source => ({
                        name: source.name,
                        value: source.completed ? '✅ Completed' : '❌ Not Completed',
                        inline: true
                    }))
                );

            await interaction.update({ embeds: [embed], components: [] });
        }
    }
});