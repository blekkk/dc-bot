const axios = require("axios");

module.exports = {
    handleNhentaiInfo: async (client, params) => {
        try {
            if (params.length === 0) {
                client.channel.send("Please enter the doujin id");
                return;
            }
            const result = await axios.get(`https://nhentai.net/api/gallery/${params}`);
            if (result.status != 404) {
                let listTags = []
                let listArtist = []
                let listParody = []
                let listCharacter = []
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
                client.channel.send(
                    `**id**: ${result.data.id}\n\n**title**: ${result.data.title.english}\n\n**Artist**:${listArtist}\n\n**Parody**:${listParody}\n\n**Character**:${listCharacter}\n\n**tags**:${listTags}\n\n**pages**: ${result.data.num_pages}\n\n**url**: https://nhentai.net/g/${result.data.id}/`
                );
            }
        } catch (e) {
            client.channel.send("Doujin not found");
        }
    }
}