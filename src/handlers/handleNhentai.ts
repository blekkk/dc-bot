import axios from 'axios';
import { MessageEmbed, Message } from 'discord.js';

module.exports = {
  handleNhentaiInfo: async (client: Message, params: String) => {
    try {
      if (params.length === 0) {
        client.channel.send("Please enter the doujin id");
        return;
      }

      const result = await axios.get(`https://nhentai.net/api/gallery/${params}`);

      let listTags: Array<String> = []
      let listArtist: Array<String> = []
      let listParody: Array<String> = []
      let listCharacter: Array<String> = []
      result.data.tags.forEach((tagEach) => {
        switch (tagEach.type) {
          case 'tag':
            listTags.push(` ${tagEach.name}`);
            break;
          case 'artist':
            listArtist.push(` ${tagEach.name}`);
            break;
          case 'parody':
            listParody.push(` ${tagEach.name}`);
            break;
          case 'character':
            listCharacter.push(` ${tagEach.name}`);
            break;
        }
      })

      let embed = new MessageEmbed()
        .setTitle(result.data.title.english)
        .setColor([0, 251, 255])
        .setDescription(
          `**id**: ${result.data.id}` +
          `\n**Artists**: ${listArtist}` +
          `\n**Parody**: ${listParody.length > 0 ? listParody : 'Original'}` +
          `\n**Characters**: ${listCharacter.length > 0 ? listCharacter : 'Original'}` +
          `\n**Tags**: ${listTags}` +
          `\n**Pages**: ${result.data.num_pages}` +
          `\n**For you Indonesians**: https://blek-bot.herokuapp.com/nhen-reader/${result.data.id}`
        )
        .setImage(`https://i.nhentai.net/galleries/${result.data.media_id}/1${result.data.images.pages[0].t === 'j' ? '.jpg' : result.data.images.pages[0].t === 'p' ? '.png' : '.gif'}`)
        .setURL(`https://nhentai.net/g/${result.data.id}`);

      client.channel.send(embed);

    } catch (e) {
      client.channel.send("Doujin not found");
    }
  }
}