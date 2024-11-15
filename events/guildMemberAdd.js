const Canvas = require('canvas');
const path = require('path');
const client = require("../index");

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 70;

	do {
		context.font = `${fontSize -= 10}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 300);

	return context.font;
}

console.log("test");
const Discord = require("discord.js");

client.on("guildMemberAdd", async member => {
    console.log("test 2");
    const canvas = Canvas.createCanvas(700, 250);
	const context = canvas.getContext('2d');

    const background = await Canvas.loadImage(path.join(__dirname, '../background.png'));
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	context.strokeStyle = '#74037b';
	context.strokeRect(0, 0, canvas.width, canvas.height);

	context.font = '28px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	context.font = applyText(canvas, `${member.displayName}!`);
	context.fillStyle = '#ffffff';
	context.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	// Begin path for profile picture
	context.beginPath();
	// Circle with 3/4ths the original size (75 radius)
	context.arc(125, 125, 75, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();

	// Draw the profile picture at the correct size (150x150) to match the 3/4ths size circle
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
	context.drawImage(avatar, 50, 50, 150, 150);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome');
    
	if (welcomeChannel) {
        welcomeChannel.send({
            content: `Welcome to the server, ${member}!`,
            files: [attachment]
        });
    }
});