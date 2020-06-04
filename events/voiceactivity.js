const handle = require('../modules/handle')

module.exports = async (client, voiceuserobject) => {
    // when channel is "null" the user left the voicechannel
    // TODO: track users and playtime yo
    console.log("voiceactivity")




    function play(connection, Guild) {
        var server = servers[Guild.id]

        server.dispatcher = connection.playStream(ytdl(server.queue[0], {
            filter: "audioonly"
        }));

        server.queue.shift();

        server.dispatcher.on("end", function () {
           server.queue.pus 
            if (server.queue[0]) {
                play(connection, message);
            } else {
                sleep(15000)
                connection.disconnect()
            }
        })
    }





    let chan = await handle.dbget(`${voiceuserobject.guild}`)
    let cache = {};

    console.log(chan)
    if (!chan) return
    const member = client.users.get(voiceuserobject.user)
    const Guild = client.guild.get(voiceuserobject.guild)


    if (!message.guild.voiceConnection) member.voiceChannel.join().then(function (connection) {
        play(connection, Guild);
        cache.push([`${member.voiceChannel.id}`, `${voiceuserobject.user}`])
    })
}