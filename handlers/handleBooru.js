//const Discord = require('discord.js');
const Danbooru = require('danbooru');
//const client = new Discord.Client();
const booru = new Danbooru();


module.exports = {
    handleSafeBooru: (client, booruParams) => {

        if (booruParams.split(' ').length < 3) {
            booru.posts({tags:`rating:safe ${booruParams}`, limit:50}).then(posts => {
                var index = Math.floor(Math.random() * posts.length)
                var post = posts[index]
                if (posts.length === 0) {
                    client.channel.send("That doesn't exist!\n\ntry using \`<CHARACTER_NAME>_(SERIES_NAME)\` as a tag");
                } else {
                    var imgPost = post.large_file_url;
                    client.channel.send(imgPost);
                }
              }).catch(err => {console.log(err);})
        } else {
            client.channel.send('Tags can only go up to 2 tags!');
        }
    },
    
    handleNotSafeBooru: (client, booruParams) => {
    
        if (booruParams.split(' ').length < 3) {
            booru.posts({tags:`rating:explicit ${booruParams}`, limit:50}).then(posts => {
                var index = Math.floor(Math.random() * posts.length)
                var post = posts[index]
                if (posts.length === 0) {
                    client.channel.send("That doesn't exist!\n\ntry using \`<CHARACTER_NAME>_(SERIES_NAME)\` as a tag");
                } else {
                    var imgPost = post.large_file_url;
                    client.channel.send(imgPost);
                }
              }).catch(err => {console.log(err);})
        } else {
            client.channel.send('Tags can only go up to 2 tags!');
        }
    }
}