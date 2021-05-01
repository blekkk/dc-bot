const Danbooru = require('danbooru');
const booru = new Danbooru();

const handleBooru = (client, booruParams, rating) => {
    if (booruParams.split(' ').length < 3) {
        booru.posts({ tags: `rating:${rating} ${booruParams}`, limit: 50 }).then(posts => {
            var index = Math.floor(Math.random() * posts.length)
            var post = posts[index]
            if (posts.length === 0) {
                client.channel.send("That doesn't exist!\n\ntry using \`<CHARACTER_NAME>_(SERIES_NAME)\` as a tag");
            } else {
                var imgPost = post.large_file_url;
                client.channel.send(imgPost);
            }
        }).catch(err => { console.log(err); })
    } else {
        client.channel.send('Tags can only go up to 2 tags!');
    }
}

module.exports = {
    handleSafeBooru: (client, booruParams) => {
        handleBooru(client, booruParams, 'safe')
    },

    handleNotSafeBooru: (client, booruParams) => {
        handleBooru(client, booruParams, 'explicit')
    }
}