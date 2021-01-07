const Discord = require('discord.js');
const Danbooru = require('danbooru');
const client = new Discord.Client();
const booru = new Danbooru();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const handleSafeBooru = (client, booruParams) => {

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
}

const handleNotSafeBooru = (client, booruParams) => {

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

const handleHelp = (client) => {
    client.reply('Do you need any help?').then( (r) => {
        r.react('✅');

        const filter = (reaction, user) => {
        return ['✅'].includes(reaction.emoji.name) && user.id === client.author.id;
        };

        r.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();

            if (reaction.emoji.name === '✅') {
                client.reply('We currently have 2 functions:\n\n\`sfwbooru\`, and\n\`nsfwbooru\`\n\n type \`blek! -h <FUNCTION_NAME>\` for help');
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
        client.reply('nsfwbooru will give you a random NSFW picture from danbooru based on your given tag\n\nExample:\n\`blek! nsfwbooru genshin_impact\`\n\`blek! nsfwbooru hololive order:rank\`\n\nNote: nsfwbooru currently only accepts up to 2 given tags');
    } else if (message[2] === 'jtk-schedule') {
        client.reply('this is a hidden function\n\njust type \`blek! jtk-schedule\`');
    }
}

const handleJTKSchedule = (client) => {
    client.channel.send('\`\`\`\n___________________________________________________\n|   MON   |   TUE   |   WED   |   THU   |   FRI   |\n| SDB TE  |Matdis II|Pancasila| PDP PR  |Matter II|\n|   AOK   | SDB PR  | KDJ TE  | KDJ PR  |         |\n|_________|_PBP TE__|_________|_________|_________|\n\`\`\`');
}

client.on('message', msg => {

    var cleanMsg = msg.content.toLowerCase().split(' ');
    var booruParams = [];
    for (let i = 2; i < cleanMsg.length; i++) {
        booruParams.push(cleanMsg[i]);
    }
    booruParams.join(' ');

    if (cleanMsg[0] === 'blek!') {
        if (cleanMsg[1] === 'sfwbooru') {
            handleSafeBooru(msg, booruParams);
        }
        if (cleanMsg[1] === 'nsfwbooru') {
            handleNotSafeBooru(msg, booruParams);
        }
        if (cleanMsg[1] === 'jtk-schedule') {
            handleJTKSchedule(msg);
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