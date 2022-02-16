import axios from 'axios';
import { MessageEmbed, Message } from 'discord.js';;

const getAnimeMALSearch = async (params) => {
  let apiParams = params.split(' ').join('%20');
  try {
    const result = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${apiParams}&page=1`);
    return result.data;
  } catch (e) {
    console.log(e);
  }
}

const Pagination = (r: Message, filter, i, embedMsg) => {
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
        .setTitle(embedMsg.results[i].title)
        .setColor([0, 251, 255])
        .setDescription(
          `Type: ${embedMsg.results[i].type}`
          + `\nStatus: ${embedMsg.results[i].airing === false ? 'Completed' : 'Airing'}`
          + `\nEpisodes: ${embedMsg.results[i].episodes}`
          + `\nRating: ${embedMsg.results[i].score}`
          + `\nMAL url: ${embedMsg.results[i].url}`
        )
        .setImage(embedMsg.results[i].image_url);

      r.edit(embed);
      Pagination(r, filter, i, embedMsg);
    })
    .catch(collected => {
      console.log("The person doesn't respond");
    });
}

module.exports = {
  malSearch: async (client: Message, params: String) => {
    if (params.length === 0) {
      client.channel.send('Please input the search query');
      return;
    }
    const embedMsg = await getAnimeMALSearch(params);
    const embed = new MessageEmbed()
      .setTitle(embedMsg.results[0].title)
      .setColor([0, 251, 255])
      .setDescription(
        `Type: ${embedMsg.results[0].type}`
        + `\nStatus: ${embedMsg.results[0].airing === false ? 'Completed' : 'Airing'}`
        + `\nEpisodes: ${embedMsg.results[0].episodes}`
        + `\nRating: ${embedMsg.results[0].score}`
        + `\nMAL url: ${embedMsg.results[0].url}`
      )
      .setImage(embedMsg.results[0].image_url);
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
}