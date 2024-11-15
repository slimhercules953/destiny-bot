const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/slash/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/slash/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        // Register for a single guild
        await client.guilds.cache
            .get("1272889396378603623")
            .commands.set(arrayOfSlashCommands);

        // Register for all the guilds the bot is in
        // await client.application.commands.set(arrayOfSlashCommands);
    })
    process.on("unhandledRejection", (reason, p) => {
    console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    console.log(reason, p);
  });
    process.on("uncaughtException", (err, origin) => {
      console.log(" [antiCrash] :: Uncaught Exception/Catch");
      console.log(err, origin);
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
      console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
      console.log(err, origin);
    });
    process.on("multipleResolves", (type, promise, reason) => {
      console.log(" [antiCrash] :: Multiple Resolves");
      console.log(type, promise, reason);
    });
}