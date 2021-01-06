const Discord = require('discord.js');
const Danbooru = require('danbooru');
const client = new Discord.Client();
const booru = new Danbooru();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const handleSafeBooru = (client, booruParams) => {
    if (booruParams.length <= 4) {
        booru.posts({tags:`rating:safe ${booruParams[2]} ${booruParams[3]}`, limit:50}).then(posts => {
            var index = Math.floor(Math.random() * posts.length)
            var post = posts[index]
            var imgPost = post.large_file_url;
            client.channel.send(imgPost);
          }).catch(err => {console.log(err);})
    } else {
        client.channel.send('Tags can only go up to 2 tags!');
    }
}

const handleNotSafeBooru = (client, booruParams) => {
    if (booruParams.length <= 4) {
        booru.posts({tags:`rating:explicit ${booruParams[2]} ${booruParams[3]}`, limit:50}).then(posts => {
            var index = Math.floor(Math.random() * posts.length)
            var post = posts[index]
            var imgPost = post.large_file_url;
            client.channel.send(imgPost);
          }).catch(err => {console.log(err);})
    } else {
        client.channel.send('Tags can only go up to 2 tags!');
    }
}

const handleHelp = (client) => {
    client.reply('Do you need any help?').then( (r) => {
        r.react('✅');

        const filter = (reaction, user) => {
        console.log(user.id);
        console.log(client.author.id);
        return ['✅'].includes(reaction.emoji.name) && user.id === client.author.id;
        };

        r.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();

            if (reaction.emoji.name === '✅') {
                client.reply('We currently have 2 methods:\n\n\`sfwbooru\`, and\n\`nsfwbooru\`\n\n type \`blek! -h <METHOD_NAME>\` for help');
            }
        })
        .catch(collected => {
            console.log(collected);
        });
    });

    
}

const handleHelpReact = (client, message) => {
    if (message[2] === 'sfwbooru') {
        client.reply('sfwbooru will give you a random SFW picture from danbooru based on your given tag\n\nExample:\n\`blek! sfwbooru genshin_impact\`\n\`blek! sfwbooru hololive order:rank\`\n\nNote: sfwbooru currently only accepts up to 2 given tags');
    } else if ( message[2] === 'nsfwbooru') {
        client.reply('sfwbooru will give you a random NSFW picture from danbooru based on your given tag\n\nExample:\n\`blek! nsfwbooru genshin_impact\`\n\`blek! nsfwbooru hololive order:rank\`\n\nNote: nsfwbooru currently only accepts up to 2 given tags');
    }
}

client.on('message', msg => {

    var cleanMsg = msg.content.split(' ');

    if (cleanMsg[0] === 'blek!') {
        if (cleanMsg[1] === 'sfwbooru') {
            handleSafeBooru(msg, cleanMsg);
        }
        if (cleanMsg[1] === 'nsfwbooru') {
            handleNotSafeBooru(msg, cleanMsg);
        }
        if (cleanMsg[1] === '-h') {
            handleHelpReact(msg, cleanMsg);
        }
        if (cleanMsg.length === 1) {
            handleHelp(msg);
        }
    }
});

client.login(`${process.env.TOKEN}`).catch((e) => console.log(e));