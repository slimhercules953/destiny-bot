const client = require("../index");

client.on("interactionCreate", async (interaction) => {
    
  
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({ content: "An error has occured " });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args);
    }
    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
    if (interaction.isSelectMenu()) {
        // Check if the select menu ID matches 'select_ticket_type'
        if (interaction.customId === 'select_ticket_type') {
            const selectedType = interaction.values[0];

            // Handle the ticket type based on the user's selection
            switch (selectedType) {
                case 'general_support':
                    await interaction.followUp({ content: 'Creating a General Support ticket...', ephemeral: true });
                    // Add logic to create a General Support ticket channel
                    break;
                case 'technical_support':
                    await interaction.followUp({ content: 'Creating a Technical Support ticket...', ephemeral: true });
                    // Add logic to create a Technical Support ticket channel
                    break;
                case 'billing_support':
                    await interaction.followUp({ content: 'Creating a Billing Support ticket...', ephemeral: true });
                    // Add logic to create a Billing Support ticket channel
                    break;
                case 'other_support':
                    await interaction.followUp({ content: 'Creating a ticket for other inquiries...', ephemeral: true });
                    // Add logic to create an "Other Support" ticket channel
                    break;
            }
        }
}
});