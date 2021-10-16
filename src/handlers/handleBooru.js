const Danbooru = require('danbooru');
const booru = new Danbooru();

const handleBooru = async (client, booruParams, rating) => {
    if (booruParams.split(' ').length >= 3) {
        client.channel.send('Tags can only go up to 2 tags!');
        return;
    }

    const posts = await booru.posts({ tags: `rating:${rating} ${booruParams}`, limit: 50 });
    if (posts.length === 0) {
        client.channel.send("That doesn't exist!\n\ntry using \`<CHARACTER_NAME>_(SERIES_NAME)\` as a tag");
        return;
    }

    const randIndex = Math.floor(Math.random() * posts.length);
    const post = posts[randIndex];
    const imgPost = post.large_file_url;
    client.channel.send(imgPost);
}

module.exports = {
    handleSafeBooru: (client, booruParams) => {
        handleBooru(client, booruParams, 'safe')
    },

    handleNotSafeBooru: (client, booruParams) => {
        handleBooru(client, booruParams, 'explicit')
    }
}