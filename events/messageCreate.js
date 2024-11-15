const client = require("../index");
const db = require('quick.db');

const role1 = 'Male';
const role2 = 'Female';
const role3 = 'Non-Binary';
const role4 = 'Genderfluid';
const role5 = "MTF";
const role6 = "FTM";
const role7 = "Other Gender";
const role8 = "Lucifer";
const role9 = "Co-Owner";

const responses = {
  [role1]: 'Good boy!',
  [role2]: 'Good girl!',
  [role3]: 'Good job darling!',
  [role4]: 'Good job darling!',
  [role5]: 'Good girl!',
  [role6]: 'Good boy!',
  [role7]: 'Good job darling!',
  [role8]: 'Well done, Lady Lucifer',
  [role9]: 'Stay in the box. Noo. Stay in the box. Noo. Get out of my skin!!!'
};
client.on('messageCreate', async message => {

  if (!message.mentions.has(client.user)) return;

  const userRoles = message.member.roles.cache.map(role => role.name);

  if (userRoles.includes(role8) && ( message.content.startsWith("Yes") || message.content.startsWith("Yep") || message.content.startsWith("yep") || message.content.startsWith("yes") || message.content.startsWith("mhm") || message.content.startsWith("Mhm")) ) {
    message.reply(responses[role8])
  } else if (userRoles.includes(role9) && ( message.content.startsWith("Coding you")) ){
    message.reply(responses[role9])
  } else if (userRoles.includes(role2) && ( message.content.startsWith("Yes") || message.content.startsWith("Yep") || message.content.startsWith("yep") || message.content.startsWith("yes") || message.content.startsWith("mhm") || message.content.startsWith("Mhm")) ) {
    message.reply(responses[role2])
  } else if (userRoles.includes(role3) && ( message.content.startsWith("Yes") || message.content.startsWith("Yep") || message.content.startsWith("yep") || message.content.startsWith("yes") || message.content.startsWith("mhm") || message.content.startsWith("Mhm")) ) {
    message.reply(responses[role3])
  } else if (userRoles.includes(role4) && ( message.content.startsWith("Yes") || message.content.startsWith("Yep") || message.content.startsWith("yep") || message.content.startsWith("yes") || message.content.startsWith("mhm") || message.content.startsWith("Mhm")) ) {
    message.reply(responses[role4])
  } else if (userRoles.includes(role5) && ( message.content.startsWith("Yes") || message.content.startsWith("Yep") || message.content.startsWith("yep") || message.content.startsWith("yes") || message.content.startsWith("mhm") || message.content.startsWith("Mhm")) ) {
    message.reply(responses[role5])
  } else if (userRoles.includes(role6) && ( message.content.startsWith("Yes") || message.content.startsWith("Yep") || message.content.startsWith("yep") || message.content.startsWith("yes") || message.content.startsWith("mhm") || message.content.startsWith("Mhm"))) {
    message.reply(responses[role6])
  } else if (userRoles.includes(role7) && ( message.content.startsWith("Yes") || message.content.startsWith("Yep") || message.content.startsWith("yep") || message.content.startsWith("yes") || message.content.startsWith("mhm") || message.content.startsWith("Mhm")) ){
    message.reply(responses[role7])
  } else if (userRoles.includes(role1) && ( message.content.startsWith("Yes") || message.content.startsWith("Yep") || message.content.startsWith("yep") || message.content.startsWith("yes") || message.content.startsWith("mhm") || message.content.startsWith("Mhm")) ){
    message.reply(responses[role1])
  }
    // Get user settings from the database
    const userSettings = db.get(`userSettings.${message.author.id}`);
    if (!userSettings) return;

    // Delete media if user is restricted
    if (userSettings.media && (message.attachments.size > 0 || message.embeds.length > 0)){
         message.delete()
         message.channel.send(`<@${message.author.id}> Lost a heart due to sending media.  They have ${userSettings.hearts} hearts left.`)
         // Assuming 'hearts' is a property in userSettings
         db.subtract(`userSettings.${message.author.id}.hearts`, 1)
    }
 
    // Delete emojis if user is restricted
    if (userSettings.emoji && message.content.match(/<:\w+:\d+>/)) {
        message.delete();
        message.channel.send(`<@${message.author.id}> Lost a heart due to sending an emoji.  They have ${userSettings.hearts} hearts left.`);
        db.subtract(`userSettings.${message.author.id}.hearts`, 1);
    }

    // Check for bad words
    if (userSettings.badWords && userSettings.badWords.length > 0) {
        const content = message.content.toLowerCase();
        for (const word of userSettings.badWords) {
            if (content.includes(word.toLowerCase())) {
                message.delete();
                message.channel.send(`<@${message.author.id}> Lost a heart due to using a bad word. They have ${userSettings.hearts} hearts left.`)
                db.subtract(`userSettings.${message.author.id}.hearts`, 1);
                break;
            }
        }
    }
  //console.log(userSettings)

    // Handle out of hearts scenario
    if (userSettings.hearts <= 0) {
      console.log("It has happened")
        const guild = message.guild;
        const member = guild.members.cache.get(message.author.id);

            member.timeout(5 * 60 * 1000,"Lost their hearts")
            await message.author.send('You have been timed out for 5 minutes due to losing all your hearts.')
            console.log(`${userSettings.hearts}`)
            db.set(`userSettings.${message.author.id}.hearts`, 3)
      let test = userSettings.hearts + 3
            console.log(`${userSettings}`)
            console.log(userSettings.hearts)
    }
  
  if (message.content.includes("https://discord.gg/VwQK3zZw")){
    message.delete()
  }
  if(message.author.bot) return;

    // Get the bad word tied to the user's account from the database
    const badWord = db.get(`badword.${message.author.id}`);

    // If the bad word exists and is found in the message content, deduct coins
    if (badWord && message.content.toLowerCase().includes(badWord.toLowerCase())) {
        // Deduct 50 coins from the user's balance
        const currentCoins = db.get(`coins.${message.author.id}`) || 0;
        db.set(`coins.${message.author.id}`, currentCoins - 50);

        // Notify the user (Optional)
        message.reply(`You said your forbidden word! 50 coins have been deducted. Your new balance is ${currentCoins - 50} coins.`);
    }
  if (message.channel.id === '1097179253310763082' && message.content.toLowerCase().includes('meow')) {
      // Link to your cat meowing gif
      const catGif = 'https://link-to-your-cat-gif.com/cat.gif';
      message.channel.send("https://media4.giphy.com/media/iiE4JfK3mVdATsb2fx/giphy.gif?cid=ecf05e4721g368tcnq0mf0iczya3fxmpiy8nc7gdyjxvyfgg&ep=v1_gifs_search&rid=giphy.gif&ct=g");
  }



  
})