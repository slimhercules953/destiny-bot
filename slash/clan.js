const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'claninfo',
    description: 'Shows information about a Destiny 2 clan.',
    options: [
        {
            name: 'clanname',
            description: 'The name of the Destiny 2 clan',
            type: 'STRING',
            required: true
        }
    ],

    run: async (client, interaction) => {
        const clanName = interaction.options.getString('clanname');

        try {
            // Step 1: Search for the Clan by Name
            const searchResponse = await fetch(`https://www.bungie.net/Platform/GroupV2/Name/${encodeURIComponent(clanName)}/1/`, {
                headers: {
                    'X-API-Key': "4db0c5c1f5264fa39fcd70592c9fd043",
                },
            });
            const searchData = await searchResponse.json();

            if (!searchData.Response || !searchData.Response.detail) {
                return interaction.followUp(`No Destiny 2 clan found with the name: ${clanName}.`);
            }

            const clanDetails = searchData.Response.detail;

            // Step 2: Fetch Clan Member Count and Other Details
            const clanId = clanDetails.groupId;
            const clanResponse = await fetch(`https://www.bungie.net/Platform/GroupV2/${clanId}/`, {
                headers: {
                    'X-API-Key': "4db0c5c1f5264fa39fcd70592c9fd043",
                },
            });
            const clanData = await clanResponse.json();

            if (!clanData.Response) {
                return interaction.followUp(`Unable to retrieve additional details for the clan: ${clanName}.`);
            }

            const clan = clanData.Response.detail;
            const memberCount = clanData.Response.detail.memberCount;
            const clanNameFormatted = clan.name;
            const clanMotto = clan.motto;
            const clanDescription = clan.about;
            const creationDate = new Date(clan.creationDate).toLocaleDateString();
            const bannerPath = `https://www.bungie.net${clan.clanInfo.clanBannerData.decalBackgroundPath}`;

            // Create Embed Message
            const embed = new MessageEmbed()
                .setTitle(`${clanNameFormatted} Clan Information`)
                .setDescription(clanDescription)
                .setThumbnail(bannerPath)
                .addField('Motto', clanMotto || 'No motto set', true)
                .addField('Member Count', memberCount.toString(), true)
                .addField('Creation Date', creationDate, true)
                .setColor('#0099FF')
                .setFooter('Destiny 2 Clan Info', 'https://www.bungie.net/img/theme/destiny/icons/icon_d2.png');

            interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.followUp('There was an error retrieving the clan information.');
        }
    }
};
