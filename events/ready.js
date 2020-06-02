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

};