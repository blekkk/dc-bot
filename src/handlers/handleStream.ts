import { Guild, Message } from "discord.js";
import { Song, SongQueue } from "../typings/songs/songs";
const ytdl = require('ytdl-core');

const streamOptions = { seek: 0, volume: 1 };
const queue: Map<string | undefined, SongQueue> = new Map();

const streamYoutube = (guild: Guild, song: Song) => {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    const id = setTimeout(() => {
      serverQueue?.voiceChannel.leave();
    }, 10000);
    clearTimeout(id);
    queue.delete(guild.id);
    return;
  }

  serverQueue?.connection
    ?.play(ytdl(song.url, { filter: 'audioonly', quality: 'lowestaudio' }), streamOptions)
    .on("finish", () => {
      serverQueue.songs.shift();
      streamYoutube(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  serverQueue?.textChannel.send(`Start playing: **${song.title}**`);
}

const playSong = async (event: Message, serverQueue: SongQueue | undefined, link: string) => {
  const voiceChannel = event.member?.voice.channel;
  if (!voiceChannel)
    return event.channel.send(
      "You need to be in a voice channel to play music!"
    );

  if (!event.guild?.me?.hasPermission("CONNECT") || !event.guild?.me?.hasPermission("CONNECT")) {
    return event.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  // this trycatch exist because nodejs is a piece of shit
  try {

    const songInfo = await ytdl.getBasicInfo(link);
    const song: Song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
      const queueContruct: SongQueue = {
        textChannel: event.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 1,
        playing: true
      };

      queue.set(event.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        let connection = await voiceChannel.join();
        queueContruct.connection = connection;
        streamYoutube(event.guild, queueContruct.songs[0])
      } catch (error) {
        console.log(error);
        queue.delete(event.guild.id);
        return event.channel.send("error");
      }
    } else {
      serverQueue.songs.push(song);
      return event.channel.send(`${song.title} has been added to the queue!`);
    }
  } catch (error) {
    console.log(error);
  }
}

const skipSong = (event: Message, serverQueue: SongQueue | undefined) => {
  if (!event.member?.voice.channel)
    return event.channel.send(
      "You have to be in a voice channel to skip the music!"
    );
  if (!serverQueue)
    return event.channel.send("There is no song that I could skip!");
  serverQueue.connection?.dispatcher.end();
}

const quitSong = (event: Message, serverQueue: SongQueue | undefined) => {
  if (!event.member?.voice.channel)
    return event.channel.send(
      "You have to be in a voice channel to stop the music!"
    );

  if (!serverQueue)
    return event.channel.send("There is no song that I could stop!");

  serverQueue.songs = [];
  serverQueue.connection?.dispatcher.end();
}

const listSong = (event: Message, serverQueue: SongQueue | undefined) => {
  if (!event.member?.voice.channel)
    return event.channel.send(
      "You have to be in a voice channel to list the music!"
    );

  if (!serverQueue)
    return event.channel.send("There is no song that I could list!");

  let upcomingList = ``;

  for (let i = 1; i < serverQueue.songs.length; i++) {
    upcomingList += `${i}. ${serverQueue.songs[i].title}\n`;
  }

  return event.channel.send(`\`\`\`\nCurrently playing: ${serverQueue.songs[0].title}\nUpcoming:\n${upcomingList}\n\`\`\``)
}

const handleStreamYoutube = async (event: Message, message: Array<string>, link: string) => {
  const serverQueue = queue.get(event.guild?.id);

  if (message[1] === 'play') {
    return playSong(event, serverQueue, link);
  } else if (message[1] === 'skip') {
    return skipSong(event, serverQueue);
  } else if (message[1] === 'quit') {
    return quitSong(event, serverQueue);
  } else if (message[1] === 'list') {
    return listSong(event, serverQueue);
  } else {
    return event.channel.send('Please select a command!');
  }
}

export { handleStreamYoutube };