const { CommandInteraction, Client, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ticket',
    description: 'Create a support ticket.',
    
    run: async (client, interaction) => {
        const guild = interaction.guild;
        const user = interaction.user;
        const categoryName = "— TICKETS —"; // The category where tickets will be created

        // Check if the user already has an open ticket
        const existingChannel = guild.channels.cache.find(
            channel => channel.name === `${user.username.toLowerCase()}-ticket`
        );
        if (existingChannel) {
            return interaction.followUp({
                content: `You already have an open ticket: ${existingChannel}.`,
                ephemeral: true // Makes the reply ephemeral
            });
        }

        // Find the category
        const category = guild.channels.cache.find(
            c => c.name === categoryName && c.type === 'GUILD_CATEGORY'
        );

        if (!category) {
            return interaction.followUp({
                content: "The category '— TICKETS —' does not exist. Please contact an admin.",
                ephemeral: true // Makes the reply ephemeral
            });
        }

        // Set permissions for the ticket channel
        const permissions = [
            {
                id: guild.roles.everyone.id, // @everyone role
                deny: [Permissions.FLAGS.VIEW_CHANNEL], // Deny viewing the channel for everyone
            },
            {
                id: user.id, // The user who opened the ticket
                allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES], // Allow them to view and send messages
            },
            {
                id: guild.roles.cache.find(role => role.name === 'Moderator'), // A Support role
                allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES], // Allow support staff to see the ticket
            },
        ];

        // Create the channel with proper name format and assign it to the category
        const ticketChannel = await guild.channels.create(`${user.username.toLowerCase()}-ticket`, {
            type: 'GUILD_TEXT',
            parent: category.id, // Assign the channel to the '— TICKETS —' category
            permissionOverwrites: permissions,
        });

        // Embed to send in the newly created ticket channel
        const embed = new MessageEmbed()
            .setTitle('Support Ticket')
            .setDescription(`Hello ${user.username}, our support team will be with you shortly.`)
            .setColor('#00FF00');

        await ticketChannel.send({ embeds: [embed] });
        interaction.followUp({
            content: `Your ticket has been created: ${ticketChannel}`,
            ephemeral: true // Makes the reply ephemeral
        });
    },
};
