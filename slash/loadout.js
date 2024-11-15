const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'loadout',
    description: 'Shows the current Destiny 2 loadout of a user.',
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

    run: async (client, interaction) => {
        const userId = interaction.options.getString('username');
        const platform = interaction.options.getString('platform');

        try {
            // Step 1: Get Membership ID
            const profileResponse = await fetch(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${platform}/${encodeURIComponent(userId)}/`, {
                headers: {
                    'X-API-Key': "4db0c5c1f5264fa39fcd70592c9fd043",
                },
            });
            const profileData = await profileResponse.json();

            if (!profileData.Response || profileData.Response.length === 0) {
                return interaction.followUp(`No Destiny 2 profile found for username: ${userId} on platform: ${platform}.`);
            }

            const membershipId = profileData.Response[0].membershipId;

            // Step 2: Get Character Data
            const characterResponse = await fetch(`https://www.bungie.net/Platform/Destiny2/${platform}/Profile/${membershipId}/?components=200`, {
                headers: {
                    'X-API-Key': "4db0c5c1f5264fa39fcd70592c9fd043",
                },
            });
            const characterData = await characterResponse.json();
            const characters = characterData.Response.characters.data;

            // Step 3: Get Loadout Data for the first character
            const characterId = Object.keys(characters)[0];
            const loadoutResponse = await fetch(`https://www.bungie.net/Platform/Destiny2/${platform}/Profile/${membershipId}/Character/${characterId}/?components=205`, {
                headers: {
                    'X-API-Key': "4db0c5c1f5264fa39fcd70592c9fd043",
                },
            });
            const loadoutData = await loadoutResponse.json();
            const loadout = loadoutData.Response.equipment.data.items;

            // Prepare Loadout Information
            let loadoutDetails = '';
            for (const item of loadout) {
                const itemResponse = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${item.itemHash}/`, {
                    headers: {
                        'X-API-Key': "4db0c5c1f5264fa39fcd70592c9fd043",
                    },
                });
                const itemData = await itemResponse.json();
                loadoutDetails += `**${itemData.Response.displayProperties.name}** - ${itemData.Response.itemTypeDisplayName}\n`;
            }

            // Create Embed Message
            const embed = new MessageEmbed()
                .setTitle(`${userId}'s Current Loadout`)
                .setDescription(loadoutDetails)
                .setColor('#0099FF');

            interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.followUp('There was an error retrieving the loadout.');
        }
    }
};
