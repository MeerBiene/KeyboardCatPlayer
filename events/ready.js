const handle = require('../modules/handle')

module.exports = async (client) => {
    
  
    // Make the bot "play the game" which is the help command with default prefix.
    client.user.setPresence({
      game: {
        name: `${client.config.content}`,
        type: `${client.config.type}`
      },
      status: 'online'
    });
    client.logger.ready(`${client.user.username} is ready to serve ${client.users.size} users in ${client.guilds.size} servers.`)

    handle.create();

    var CronJob = require('cron').CronJob;
    var job = new CronJob(
      `0 * */${client.config.interval} * * *`,
      async function () {
        let users = client.users
        for (let user in users) {
          if (users.hasOwnProperty(user)) {
            let data = users[user]
            let checkvar = handle.get("user", user.id)
            if (!checkvar) return
            let h = checkvar.hours
            if (checkvar.channel) {
              let hint = parseInt(h)
              let newt = hint + client.config.interval
              handle.update("hours", newt, user.id)
            }
          }
        } 
      },
      null,
      true,
      "America/Los_Angeles"
    );
    job.start();

    client.logger.ready(`Cron Job started successfully!`)

};