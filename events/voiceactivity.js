const handle = require("../modules/handle");

module.exports = async (client, voiceuserobject) => {
  // when channel is "null" the user left the voicechannel
  // TODO: track users and playtime yo
  console.log("voiceactivity");

  // queue cache
  var servers = {};

  function play(connection, Guild) {
    var server = servers[Guild.id];

    server.dispatcher = connection.playStream(
      ytdl(server.queue[0], {
        filter: "audioonly",
      })
    );

    server.queue.shift();

    server.dispatcher.on("end", function () {
      server.queue.push("https://www.youtube.com/watch?v=NTui4VtozkM");
      if (server.queue[0]) {
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
    let cache = [];

    console.log(chan);
    if (!chan) return;
    const member = client.users.get(voiceuserobject.user);
    const Guild = client.guild.get(voiceuserobject.guild);

    if (!servers[Guild.id])
      servers[Guild.id] = {
        queue: [],
      };

    var server = servers[Guild.id];

    if (!message.guild.voiceConnection)
      member.voiceChannel.join().then(function (connection) {
        server.queue.push("https://www.youtube.com/watch?v=NTui4VtozkM");
        play(connection, Guild);
        handle.get("user", member.user.id).then((user) => {
          if (user) {
            // TODO: update userchannel
            handle.update(
              "channel",
              `${voiceuserobject.channel}`,
              `${member.user.id}`
            );
            handle.update(
              "channelspecificguild",
              `${Guild.id}`,
              `${member.user.id}`
            );
          } else {
            let userobject = {
              user: `${member.user.id}`,
              channel: `${voiceuserobject.channel}`,
              channelspecificguild: `${Guild.id}`,
              hours: "0",
            };
            handle.push(userobject);
          }
        });
      });
  } else if (!voiceuserobject.channel) {
    // member left
    let checkchan = handle.get("user", voiceuserobject.user.id);

    let emtpycheck = handle.get("channel", checkchan[0].channel);

    handle.update("channel", "", voiceuserobject.user.id);
    handle.update("channelspecificguild", "", voiceuserobject.user.id);

    if (emtpycheck[0]) return;

    let Guild = client.guilds.get(voiceuserobject.guild);
    let chan = Guild.channels.get(checkchan.channel);

    chan.leave();
  }
};