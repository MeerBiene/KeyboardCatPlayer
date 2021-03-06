const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const chalk = require("chalk")


const client = new Discord.Client();

client.config = require("./config.js");

client.logger = require("./modules/Logger");


require("./modules/functions.js")(client);
require("./modules/embeds.js")(client);


client.commands = new Enmap();
client.aliases = new Enmap();


const init = async () => {
  
    async function load(category) {
      let name = category.toUpperCase()
      const cmdFilesFun = await readdir(`./commands/${category}/`);
      let amount = cmdFilesFun.length
      client.logger.log(`${chalk.bgBlue("[CATGEORY]")} [${name}] [COMMANDS: ${chalk.green(amount)}]`);
      cmdFilesFun.forEach(f => {
        if (!f.endsWith(".js")) return;
        const response = client.loadCommand(category, f);
        if (response) console.log(response);
      });
    }


   
  
    
  
    var categorys = [
      'system'
    ]
  
    categorys.forEach(c => {
      load(c);
    
    })
  
  
  
  
    const evtFiles = await readdir("./events/");
    let amount = evtFiles.length
    client.logger.log(`${chalk.bgBlue("[EVENTS]")} Loading ${chalk.green(amount)} events.`);
    evtFiles.forEach(file => {
      const eventName = file.split(".")[0];
      client.logger.log(`[EVENT] Loading Event: ${eventName}`);
      const event = require(`./events/${file}`);
  
      client.on(eventName, event.bind(null, client));
    });
  
    
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
      const thisLevel = client.config.permLevels[i];
      client.levelCache[thisLevel.name] = thisLevel.level;
    }
  
  

    client.on('raw', packet => {
      // We don't want this to run on unrelated packets
      if (!['VOICE_STATE_UPDATE'].includes(packet.t)) return;
      
      if (packet.t === 'VOICE_STATE_UPDATE') {
  
        // if channel is null the member left the channel
        let user = packet.d.user_id
        let guild = packet.d.guild_id
        let channel = packet.d.channel_id
        const voiceuserobject = {
          user,
          guild,
          channel
        }
  
        client.emit('voiceactivity', voiceuserobject)
  
      } 
    });
    client.login(client.config.token);
};
  
init();