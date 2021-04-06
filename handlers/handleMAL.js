const { MessageEmbed } = require('discord.js');
const axios = require("axios");

const getAnimeMALSearch = async (params) => {
    let apiParams = params.split(' ').join('%20');
    try {
        const result = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${apiParams}&page=1`);
        return result;
    } catch (e) {
        console.log(e);
    }
}

const Pagination = (r, filter, i, embedMsg) => {
    r.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();
            if (reaction.emoji.name === '▶️') {
                i++;
            }
            else {
                if (i !== 0)
                    i--;
            }
            const embed = new MessageEmbed()
                .setTitle(embedMsg.data.results[i].title)
                .setColor([0, 251, 255])
                .setDescription(
                    `Type: ${embedMsg.data.results[i].type}
                Status: ${embedMsg.data.results[i].airing === false ? 'Completed' : 'Airing'}
                Episodes: ${embedMsg.data.results[i].episodes}
                Rating: ${embedMsg.data.results[i].score}
                MAL url: ${embedMsg.data.results[i].url}`
                )
                .setImage(embedMsg.data.results[i].image_url);

            r.edit(embed);
            Pagination(r, filter, i, embedMsg);
        })
        .catch(collected => {
            console.log("The person doesn't respond");
        });
}

module.exports = {
    malSearch: async (client, params) => {
        if (params.length === 0) {
            client.channel.send('Please input the search query');
            return;
        }
        const embedMsg = await getAnimeMALSearch(params);
        const embed = new MessageEmbed()
            .setTitle(embedMsg.data.results[0].title)
            .setColor([0, 251, 255])
            .setDescription(
                `Type: ${embedMsg.data.results[0].type}
                Status: ${embedMsg.data.results[0].airing === false ? 'Completed' : 'Airing'}
                Episodes: ${embedMsg.data.results[0].episodes}
                Rating: ${embedMsg.data.results[0].score}
                MAL url: ${embedMsg.data.results[0].url}`
            )
            .setImage(embedMsg.data.results[0].image_url);
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