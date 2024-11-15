const client = require("../index");
const { MessageEmbed } = require("discord.js")
client.on("ready", () =>
    console.log(`${client.user.tag} is up and ready to go!`)
)
client.on("ready", () => 
  client.user.setActivity(`Guardians solo GMs`, { type: 'WATCHING' })
)
const express = require('express');
const app = express();
const PORT = 3000; // or whatever port you'd like
const path = require('path');

app.use(express.static('public'));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    /*app.get('/', (req, res) => {
        res.send('Hello World!');
    });*/

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });;

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
});