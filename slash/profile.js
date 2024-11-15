const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
//require('dotenv').config();

module.exports = {
    name: 'profile',
    description: 'Shows a Destiny 2 user profile.',
    options: [
        {
            name: 'username',
            description: 'The username of the Destiny 2 player',
            type: 'STRING',
            required: true
        },
        {
            name: 'platform',
            description: 'The platform of the player (1: Xbox, 2: PSN, 3: Steam)',
            type: 'STRING',
            required: true
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const userId = interaction.options.getString('username');
        const platform = interaction.options.getString('platform');

        try {
            const response = await fetch(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${platform}/${encodeURIComponent(userId)}/`, {
                headers: {
                    'X-API-Key': "4db0c5c1f5264fa39fcd70592c9fd043",
                },
            });

            const data = await response.json();

            if (!data.Response || data.Response.length === 0) {
                return interaction.followUp({ content: `No Destiny 2 profile found for username: ${userId} on platform: ${platform}.`, ephemeral: true });
            }

            const profile = data.Response[0];

            const embed = new MessageEmbed()
                .setTitle('Destiny 2 Profile')
                .setDescription(`**Display Name:** ${profile.displayName}\n**Membership ID:** ${profile.membershipId}\n**Membership Type:** ${profile.membershipType}`)
                .setColor('#0099FF');

            interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.followUp({ content: 'There was an error retrieving the profile.', ephemeral: true });
        }
    }
};
