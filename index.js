require('dotenv').config()
const Discord = require('discord.js');
const { handleSafeBooru, handleNotSafeBooru } = require('./src/handlers/handleBooru');
const { handleNhentaiInfo } = require('./src/handlers/handleNhentai');
const { handleEmojify } = require('./src/handlers/handleEmojify');
const { handleHelp, handleHelpReact } = require('./src/handlers/handleHelp');
const { malSearch } = require('./src/handlers/handleMAL');
const { handleStreamYoutube } = require('./src/handlers/handleStream');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async event => {
    let commandParams = event.content.toLowerCase().split(' ');
    let cleanMsg = commandParams.slice(2).join(' ');
    let ytLink = event.content.split(' ')[3];

    if (commandParams[0] === 'blek!') {
        switch (commandParams[1]) {
            case 'sfwbooru':
                handleSafeBooru(event, cleanMsg);
                break;
            case 'nsfwbooru':
                handleNotSafeBooru(event, cleanMsg);
                break;
            case '-h':
                handleHelpReact(event, commandParams);
                break;
            case 'emojify':
                handleEmojify(event, cleanMsg);
                break;
            case 'nhentai-info':
                await handleNhentaiInfo(event, cleanMsg);
                break;
            case 'mal-search':
                await malSearch(event, cleanMsg);
                break;
            case 'voice':
                handleStreamYoutube(event, commandParams, ytLink);
                break;
            case undefined:
                handleHelp(event);
                break;
            default:
                event.channel.send('What do you mean?');
                break;
        }
    } else if ((/.*t(m){2,}k.*/gi).test(event.content.replace(/\s/g, ''))) {
        event.channel.send('Jangan ada diskriminasi diantara kita');
    }
});

client.login(process.env.TOKEN).catch((e) => console.log(e));
