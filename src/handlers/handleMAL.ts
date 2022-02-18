import axios from 'axios';
import { MessageEmbed, Message, CollectorFilter } from 'discord.js';import { Anime, AnimeSearch } from '../typings/MAL/getAnimeSearch';
;

const getAnimeMALSearch = async (params: string): Promise<Anime[]> => {
  let apiParams = params.split(' ').join('%20');
  try {
    const result = await axios.get<AnimeSearch>(`https://api.jikan.moe/v4/anime?q=${apiParams}&page=1`);
    return result.data.data;
  } catch (e) {
    console.log(e);
    throw(e);
  }
}

const Pagination = (r: Message, filter: CollectorFilter, i: number, embedMsg: Anime[]): void => {
  r.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
    .then(collected => {
      const reaction = collected.first();
      if (reaction?.emoji.name === '▶️') {
        i++;
      }
      else {
        if (i !== 0)
          i--;
      }
      const embed = new MessageEmbed()
        .setTitle(embedMsg[i].title)
        .setColor([0, 251, 255])
        .setDescription(
          `Type: ${embedMsg[i].type}`
          + `\nStatus: ${embedMsg[i].airing === false ? 'Completed' : 'Airing'}`
          + `\nEpisodes: ${embedMsg[i].episodes}`
          + `\nRating: ${embedMsg[i].score}`
          + `\nMAL url: ${embedMsg[i].url}`
        )
        .setImage(embedMsg[i].images.webp.image_url);

      r.edit(embed);
      Pagination(r, filter, i, embedMsg);
    })
    .catch(collected => {
      console.log("The person doesn't respond");
    });
}


const malSearch = async (client: Message, params: string): Promise<void> => {
  if (params.length === 0) {
    client.channel.send('Please input the search query');
    return;
  }
  const embedMsg = await getAnimeMALSearch(params);
  const embed = new MessageEmbed()
    .setTitle(embedMsg[0].title)
    .setColor([0, 251, 255])
    .setDescription(
      `Type: ${embedMsg[0].type}`
      + `\nStatus: ${embedMsg[0].airing === false ? 'Completed' : 'Airing'}`
      + `\nEpisodes: ${embedMsg[0].episodes}`
      + `\nRating: ${embedMsg[0].score}`
      + `\nMAL url: ${embedMsg[0].url}`
    )
    .setImage(embedMsg[0].images.webp.image_url);
  client.channel.send(embed).then((r) => {
    let i = 0;

    r.react('◀️');
    r.react('▶️');

    const filter = (reaction, user) => {
      return ['▶️', '◀️'].includes(reaction.emoji.name) && user.id === client.author.id;
    };

    Pagination(r, filter, i, embedMsg);
  })
}

export { malSearch };