const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'raidstats',
    description: 'Shows the raid completions and statistics for a Destiny 2 user.',
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

            // Step 2: Get Profile Data including Raid stats
            const statsResponse = await fetch(`https://www.bungie.net/Platform/Destiny2/${platform}/Account/${membershipId}/Character/0/Stats/?groups=1,2`, {
                headers: {
                    'X-API-Key': "4db0c5c1f5264fa39fcd70592c9fd043",
                },
            });
            const statsData = await statsResponse.json();

            if (!statsData.Response) {
                return interaction.followUp(`No raid data found for username: ${userId}.`);
            }

            const raidStats = statsData.Response.raid.allTime;

            // Extract relevant raid statistics
            const completions = raidStats.activitiesCleared ? raidStats.activitiesCleared.basic.value : 0;
            const totalKills = raidStats.kills ? raidStats.kills.basic.value : 0;
            const precisionKills = raidStats.precisionKills ? raidStats.precisionKills.basic.value : 0;
            const kdRatio = raidStats.killsDeathsRatio ? raidStats.killsDeathsRatio.basic.displayValue : 'N/A';

            // Create Embed Message
            const embed = new MessageEmbed()
                .setTitle(`${userId}'s Raid Statistics`)
                .setDescription(`Here are the raid stats for ${userId}`)
                .addField('Completions', completions.toString(), true)
                .addField('Total Kills', totalKills.toString(), true)
                .addField('Precision Kills', precisionKills.toString(), true)
                .addField('K/D Ratio', kdRatio, true)
                .setColor('#0099FF');

            interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.followUp('There was an error retrieving the raid statistics.');
        }
    }
};
