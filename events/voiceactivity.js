const handle = require("../modules/handle");
const ytdl = require('ytdl-core')

module.exports = async (client, voiceuserobject) => {

  const queue = [
    'https://www.youtube.com/watch?v=Ngqf466AVb8',
    'https://www.youtube.com/watch?v=Ngqf466AVb8'
  ]
  
  // when channel is "null" the user left the voicechannel
  // TODO: track users and playtime yo
  console.log(voiceuserobject);

  let Guild = client.guilds.get(voiceuserobject.guild);
  let member = Guild.fetchMember(voiceuserobject.user)
  // queue cache
  

  function play(connection, Guild) {
    

    
    dispatcher = connection.playStream(
      ytdl(queue[0], {
        filter: "audioonly",
        filter: format => format.container === 'mp4'
      })
    );

    queue.shift();

    dispatcher.on("end", function () {
      queue.push("https://www.youtube.com/watch?v=Ngqf466AVb8");
      if (queue[0]) {
        play(connection, Guild);
      } else {
        connection.disconnect();
      }
    });
  }

  /**
   * @typedef {Object} userobject
   * @property {String} user - user id (discord ID)
   * @property {String} channel - channel the user is vibing in (will be null when user is not in VC)
   * @property {String} channelspecificguild - guild where the user is vibing in the voicechannel (will be null when user is not in VC)
   * @property {String} hours - total hours that the user spent listening.
   */

  if (voiceuserobject.channel) {
    let chan = await handle.dbget(`${voiceuserobject.guild}`);
    

    //console.log(chan);
    if (!chan) return;
   
    const Guild = client.guilds.get(voiceuserobject.guild);
    
    
   
    

    //console.log(member)

    if (!Guild.voiceConnection)

    chann = Guild.channels.get(chan)

    
      chann.join().then(function (connection) {
       
        queue.push("https://www.youtube.com/watch?v=Ngqf466AVb8");
        play(connection, Guild);
        handle.get("user", voiceuserobject.user).then((user) => {
          if (user) {
            // TODO: update userchannel
            handle.update(
              "channel",
              `${voiceuserobject.channel}`,
              `${voiceuserobject.user}`
            );
            handle.update(
              "channelspecificguild",
              `${Guild.id}`,
              `${voiceuserobject.user}`
            );
          } else {
            let userobject = {
              user: `${voiceuserobject.user}`,
              channel: `${voiceuserobject.channel}`,
              channelspecificguild: `${voiceuserobject.guild}`,
              hours: "0",
            };
            handle.push(userobject);
          }
        });
      });
  } else if (!voiceuserobject.channel) {
    // member left
    let checkchan = await handle.get("user", voiceuserobject.user);
    console.log(checkchan)

    let emtpycheck = handle.get("channel", checkchan[0].channel);

    handle.update("channel", "", voiceuserobject.user);
    handle.update("channelspecificguild", "", voiceuserobject.user);

    if (emtpycheck[0]) return;

    
    let chan = Guild.channels.get(checkchan.channel);

    chan.leave();
  }
};