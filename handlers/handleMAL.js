const { MessageEmbed } = require('discord.js');
const axios = require("axios");

const getAnimeMALSearch = async (params) => {
    let apiParams = params.split(' ').join('%20');
    try {
        const result = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${apiParams}&page=1`);
        console.log(result);
        return result;
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    malSearch: async (client, params) => {
        if (params.length === 0) {
            client.channel.send('Please input the search query');
            return;
        }
        const embedMsg = await getAnimeMALSearch(params);
        const embed = new MessageEmbed()
            // Set the title of the field
            .setTitle(embedMsg.data.results[0].title)
            // Set the color of the embed
            .setColor([0, 251, 255])
            .setDescription(
                `Type: ${embedMsg.data.results[0].type}
                Status: ${embedMsg.data.results[0].airing === false ? 'Completed' : 'Airing'}
                Episodes: ${embedMsg.data.results[0].episodes}
                Rating: ${embedMsg.data.results[0].score}
                MAL url: ${embedMsg.data.results[0].url}`
            )
            // Set the main content of the embed
            .setImage(embedMsg.data.results[0].image_url);
        // Send the embed to the same channel as the message
        client.channel.send(embed);
    }
}