const Discord = require('discord.js')

const talkedRecently = new Set();
const cmdRecently = new Set();

module.exports = async (client, message) => {


if (message.author.bot) return  
  

    const msgdel = client.config.msgdelete
    //const settings = client.dbgetconfig(message)
    const Prefix = "!"


  
 // yo tbh im just putitng something here cause i want a commit today and i dont want to break
 // my streak.. sorry.





    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
      return message.reply(client.embed(`My prefix on this guild is ${Prefix}` ))
          .then(msg => { msg.delete(msgdel).catch(error => {}) });
    }
  
  
    if (message.content.indexOf(Prefix) !== 0) return;
  
  
    const args = message.content.slice(Prefix.length).trim().split(/ +/g);

  
    const command = args.shift().toLowerCase();
  
  
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);
  
  
    const level = client.permlevel(message);
  
  
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  
    if (!cmd) return;
  
  
    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send(client.warning("This command is unavailable via private message. Please run this command in a guild."));
  
  
  
    if (level < client.levelCache[cmd.conf.permLevel]) {
    
    
        return message.channel.send(client.warning(`You do not have permission to use this command.
    > Your permission level is **${client.config.permLevels.find(l => l.level === level).name}**
    > This command requires **${cmd.conf.permLevel}**`)).then(msg => {
          message.delete(msgdel).catch(error => {
            
          })
          msg.delete(msgdel).catch(error => {
            
          })
        })
     
    }
  
  
    message.author.permLevel = level;
  
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
  
    // global cooldown here
    if (cmdRecently.has(message.author.id)) {
      return message.reply(client.warning(`Please wait  \`${client.config.cooldown / 1000}\`  seconds before doing this command again!`)).then(msg => {
        msg.delete(msgdel).catch(error => {
          
        })
        message.delete(msgdel).catch(error => {});
      })
    } else {
      cmdRecently.add(message.author.id)
      setTimeout(() => {
        cmdRecently.delete(message.author.id)
      }, client.config.cooldown)
  
      
  
      client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (ID: ${message.author.id}) ran the command '${cmd.help.name}', in the guild '${message.guild.name}' (ID: ${message.guild.id})`);
      try {
        cmd.run(client, message, args, level);
      } catch (e) {
        
      }
    }









}