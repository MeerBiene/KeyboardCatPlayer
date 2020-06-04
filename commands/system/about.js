import {RichEmbed} from 'discord.js'
const msgdel = client.config.msgdelete

exports.run = async (client, message, args, level) => { 

    let about = new RichEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
    .addField(`__**Developer(s):**__`, `<@686669011601326281>`)
    .addField(`__**Repo link:**__`, `[Github]('https://github.com/MeerBiene/KeyboardCatPlayer')`)

    message.channel.send(about).then(msg => {
        try {
            msg.delete(msgdel)
        } catch(e) {
            client.debug(e)
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