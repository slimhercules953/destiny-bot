// commands/ticket.js

const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'test',
    description: 'Open a ticket based on the type of support needed.',
    
    run: async (client, interaction) => {
        const embed = new MessageEmbed()
            .setTitle('Open a Ticket')
            .setDescription('Please choose the type of ticket you want to open from the dropdown below.')
            .setColor('#00FF00');

        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('select_ticket_type')
                .setPlaceholder('Select Ticket Type')
                .addOptions([
                    {
                        label: 'General Support',
                        description: 'Open a ticket for general support.',
                        value: 'general_support',
                    },
                    {
                        label: 'Technical Support',
                        description: 'Open a ticket for technical issues.',
                        value: 'technical_support',
                    },
                    {
                        label: 'Billing Support',
                        description: 'Open a ticket for billing inquiries.',
                        value: 'billing_support',
                    },
                    {
                        label: 'Other',
                        description: 'Open a ticket for other inquiries.',
                        value: 'other_support',
                    },
                ])
        );

        await interaction.followUp({
            embeds: [embed],
            components: [row],
            ephemeral: true,
        });
    },
};
