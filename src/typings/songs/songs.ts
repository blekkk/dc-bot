import { DMChannel, NewsChannel, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";

export interface Song {
  title: string,
  url: string
}

export interface SongQueue {
  textChannel: TextChannel | DMChannel | NewsChannel,
  voiceChannel: VoiceChannel,
  connection: VoiceConnection | null,
  songs: Array<Song>,
  volume: number,
  playing: boolean
}