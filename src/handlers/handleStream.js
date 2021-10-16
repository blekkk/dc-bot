const ytdl = require('ytdl-core');

const streamOptions = { seek: 0, volume: 1 };
const ytLinks = [];
let voiceChannel;

const streamYoutube = (connection, link) => {
  const stream = ytdl(link, { filter: 'audioonly' });
  const dispatcher = connection.play(stream, streamOptions);
  dispatcher.on('finish', end => {
    if (ytLinks.length === 0)
      setTimeout(() => {
        voiceChannel.leave();
      }, 10000);
    let ytLink = ytLinks.shift();
    streamYoutube(connection, ytLink);
  });
}

const addYtLink = (link) => {
  ytLinks.push(link);
}

module.exports = {
  handleStreamYoutube: async (event, message, link) => {
    if (message[2] === 'add' && link != undefined) {
      addYtLink(link);
      event.channel.send('Added');
    }

    if (message[2] === 'join' && link != undefined) {
      voiceChannel = event.member.voice.channel;
      try {
        let connection = await voiceChannel.join();
        addYtLink(link);
        let ytLink = ytLinks.shift();
        streamYoutube(connection, ytLink);
      } catch (error) {
        console.log(error);
      }
    }
  }
}