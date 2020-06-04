const Discord = require('discord.js')

exports.run = async (client, message, args, level) => { 

    const msgdel = client.config.msgdelete
    let about = new Discord.RichEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
    .addField(`__**Developer(s):**__`, `<@686669011601326281>`)
    .addField(`__**Repo link:**__`, `[Fork me on github!](https://github.com/MeerBiene/KeyboardCatPlayer)`)
    .addField(`__**Stats:**__`, "```" + "1k lines of code. \nUsers: \nGuilds: \nMem Usage:" + "```")
    .setColor("#fffb0a")

    message.channel.send(about).then(msg => {
        try {
            msg.delete(msgdel)
        } catch(e) {
           console.error(new Date(), e)
        }
    })
    
};


exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['info'],
    permLevel: "User"
};

exports.help = {
    name: "about",
    category: "System",
    description: "Display bot information.",
    usage: `about`
};