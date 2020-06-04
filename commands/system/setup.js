const handle = require('../../modules/handle')
exports.run = async (client, message, args, level) => { 

    const msgdel = client.config.msgdelete

    /*

    Idea: ask user if I should make channel or he wants to
    enter a channel ID.
    Important: inform user only one channel works for
    more channels invite more bots 

    Channel template:
    - everyone: no speak
    - bot: severmute
    - name: doesnt matter

    */



    // TODO: save ID 
    async function makerfunc() {
        message.guild.createChannel('KeyBoardCat!', {
            type: "voice",
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ["SPEAK"]
                }
            ]
        }).then(async chan => {
            await handle.create();
            await handle.dbpush(`${message.guild.id}`, `${chan.id}`)
            message.channel.send(client.success(`Saved ${chan} as your default voice channel.`)).then(msg => {
                msg.delete(msgdel).catch()
            })
        })
    }


    async function idsaverfunc() {
        let response = await client.awaitReply(message, 'Please enter your Channels ID now. \nIf you don\'t know how to get Channel IDs, please take a look at this tutorial: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID- \nYou have 3 Minutes.', 240000)
        let valid = message.guild.channels.get(response)
        if (!valid) return message.channel.send(client.error('This is not a valid ID. Please try again by using the setup command again!'))
        if (valid.type != "voice") return message.channel.send(client.error('This is not a Voice channel. Please try again by using the setup command again!'))
        await handle.create();
        await handle.dbpush(`${message.guild.id}`, `${valid.id}`)
        message.channel.send(client.success(`Saved \`${valid.name}\` as your default channel.`))
    }

    
    
    message.channel.send(client.embed('Hello, welcome to your setup. \nTheres only one step required: \n\nDo you want me to create your voicechannel, or do you want to enter the ID of an already existing one? \n\nIf you want me to do all the work, react with #️⃣ \nIf you want to enter the ID of an existing channel, react with 🆔')).then(async msg => {
        let emoji = await client.promptMessage(msg, message.author, 90, ["#️⃣", "🆔"])
        
        if (emoji == "#️⃣") {
            msg.delete().catch();
            makerfunc();
        } else if (emoji === "🆔") {
            msg.delete().catch();
            idsaverfunc();
        }
    })

};


exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "ADMIN"
};

exports.help = {
    name: "setup",
    category: "System",
    description: "Set up your bot.",
    usage: `setup`
};