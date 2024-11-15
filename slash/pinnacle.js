const { CommandInteraction, Client, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

// Temporary storage for tracking completed activities per user

const userPinnacleProgress = new Map();

module.exports = {

    name: 'pinnacle',

    description: 'List all activities that reward Pinnacle gear this week and check off completed ones.',

    run: async (client, interaction) => {

        const userId = interaction.user.id;

        const activities = [

            'Nightfall: Grandmaster',

            'Raids',

            'Dungeons',

            'Seasonal Activity',

            'Vanguard Ops',

        ];

        // Initialize user progress if it doesn't exist

        if (!userPinnacleProgress.has(userId)) {

            userPinnacleProgress.set(userId, new Set());

        }

        // Get the user's current progress

        const completedActivities = userPinnacleProgress.get(userId);

        // Create buttons for each activity

        const rows = activities.map((activity, index) => {

            const isCompleted = completedActivities.has(activity);

            return new MessageActionRow().addComponents(

                new MessageButton()

                    .setCustomId(`pinnacle_${index}`)

                    .setLabel(isCompleted ? `✅ ${activity}` : activity)

                    .setStyle(isCompleted ? 'SUCCESS' : 'PRIMARY')

            );

        });

        // Embed message

        const embed = new MessageEmbed()

            .setTitle('Pinnacle Gear Sources')

            .setDescription("Check off activities as you complete them for this week's Pinnacle rewards.")

            .setColor('#FFD700')

            .setFooter({ text: 'Reset happens every Tuesday at 9 AM PT' })

            .setThumbnail('https://www.bungie.net/img/theme/destiny/icons/icon_pinnacle.png');

        await interaction.followUp({ embeds: [embed], components: rows });

        // Set up an interaction collector for the buttons

        const filter = i => i.customId.startsWith('pinnacle_') && i.user.id === userId;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 86400000 }); // 24 hours

        collector.on('collect', async buttonInteraction => {

            const index = parseInt(buttonInteraction.customId.split('_')[1], 10);

            const activity = activities[index];

            // Toggle activity completion status

            if (completedActivities.has(activity)) {

                completedActivities.delete(activity); // Uncheck if already checked

            } else {

                completedActivities.add(activity); // Check if not yet checked

            }

            // Update the buttons

            const updatedRows = activities.map((activity, i) => {

                const isCompleted = completedActivities.has(activity);

                return new MessageActionRow().addComponents(

                    new MessageButton()

                        .setCustomId(`pinnacle_${i}`)

                        .setLabel(isCompleted ? `✅ ${activity}` : activity)

                        .setStyle(isCompleted ? 'SUCCESS' : 'PRIMARY')

                );

            });

            await buttonInteraction.update({ components: updatedRows });

        });

        collector.on('end', () => {

            interaction.editReply({ content: 'This interaction has expired.', components: [] });

        });

    }

};