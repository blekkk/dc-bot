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
    client.reply('do you need any help?').then( (r) => {
        r.react('✅');

        const filter = (reaction, user) => {
        return ['✅'].includes(reaction.emoji.name) && user.id === client.author.id;
        };

        r.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();

            if (reaction.emoji.name === '✅') {
                client.reply('we currently have 3 functions:\n\n\`sfwbooru\`, \n\`nsfwbooru\`\n, and \`emojify\`\n\n type \`blek! -h <FUNCTION_NAME>\` for help');
            }
        })
        .catch(collected => {
            console.log("The person doesn't respond");
        });
    });
}
//GONNA SPLIT IT TO ANOTHER FILE LATER
const handleEmojify = (client, message) => {
    
    let emojiMessage = [];
    message = message.split('');

    message.forEach((msgChar) => {
        switch (msgChar) {
            case '0':
                emojiMessage.push(':zero:');
                break;
            case '1':
                emojiMessage.push(':one:');
                break;
            case '2':
                emojiMessage.push(':two:');
                break;
            case '3':
                emojiMessage.push(':three:');
                break;
            case '4':
                emojiMessage.push(':four:');
                break;
            case '5':
                emojiMessage.push(':five:');
                break;
            case '6':
                emojiMessage.push(':six:');
                break;
            case '7':
                emojiMessage.push(':seven:');
                break;
            case '8':
                emojiMessage.push(':eight:');
                break;
            case '9':
                emojiMessage.push(':nine:');
                break;
            case 'a':
                emojiMessage.push(':regional_indicator_a:');
                break;
            case 'b':
                emojiMessage.push(':regional_indicator_b:');
                break;
            case 'c':
                emojiMessage.push(':regional_indicator_c:');
                break;
            case 'd':
                emojiMessage.push(':regional_indicator_d:');
                break;
            case 'e':
                emojiMessage.push(':regional_indicator_e:');
                break;
            case 'f':
                emojiMessage.push(':regional_indicator_f:');
                break;
            case 'g':
                emojiMessage.push(':regional_indicator_g:');
                break;
            case 'h':
                emojiMessage.push(':regional_indicator_h:');
                break;
            case 'i':
                emojiMessage.push(':regional_indicator_i:');
                break;
            case 'j':
                emojiMessage.push(':regional_indicator_j:');
                break;
            case 'k':
                emojiMessage.push(':regional_indicator_k:');
                break;
            case 'l':
                emojiMessage.push(':regional_indicator_l:');
                break;
            case 'm':
                emojiMessage.push(':regional_indicator_m:');
                break;
            case 'n':
                emojiMessage.push(':regional_indicator_n:');
                break;
            case 'o':
                emojiMessage.push(':regional_indicator_o:');
                break;
            case 'p':
                emojiMessage.push(':regional_indicator_p:');
                break;
            case 'q':
                emojiMessage.push(':regional_indicator_q:');
                break;
            case 'r':
                emojiMessage.push(':regional_indicator_r:');
                break;
            case 's':
                emojiMessage.push(':regional_indicator_s:');
                break;
            case 't':
                emojiMessage.push(':regional_indicator_t:');
                break;
            case 'u':
                emojiMessage.push(':regional_indicator_u:');
                break;
            case 'v':
                emojiMessage.push(':regional_indicator_v:');
                break;
            case 'w':
                emojiMessage.push(':regional_indicator_w:');
                break;
            case 'x':
                emojiMessage.push(':regional_indicator_x:');
                break;
            case 'y':
                emojiMessage.push(':regional_indicator_y:');
                break;
            case 'z':
                emojiMessage.push(':regional_indicator_z:');
                break;
            case ' ':
                emojiMessage.push(' ');
                break;
        }
    });
    emojiMessage = emojiMessage.join(' ');
    client.channel.send(emojiMessage);
}
const handleHelpReact = (client, message) => {
    if (message[2] === 'sfwbooru') {
        client.reply('sfwbooru will give you a random SFW picture from danbooru based on your given tag\n\nExample:\n\`blek! sfwbooru genshin_impact\`\n\`blek! sfwbooru hololive order:rank\`\n\nNote: sfwbooru currently only accepts up to 2 given tags');
    } else if ( message[2] === 'nsfwbooru') {
        client.reply('nsfwbooru will give you a random NSFW picture from danbooru based on your given tag\n\nExample:\n\`blek! nsfwbooru genshin_impact\`\n\`blek! nsfwbooru hololive order:rank\`\n\nNote: nsfwbooru currently only accepts up to 2 given tags');
    } else if (message[2] === 'jtk-schedule') {
        client.reply('this is a hidden function\n\njust type \`blek! jtk-schedule\`');
    } else if (message[2] === 'emojify') {
        client.reply('emojify your messages!\n\nJust type \`blek emojify <YOUR_MESSAGES>\`');
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
    booruParams = booruParams.join(' ');

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
        if (cleanMsg[1] === 'emojify') {
            handleEmojify(msg,booruParams);
        }
        if (cleanMsg.length === 1) {
            handleHelp(msg);
        }
    }
});

client.login(`${process.env.TOKEN}`).catch((e) => console.log(e));