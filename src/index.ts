import { Client, Message } from 'discord.js';
const { handleSafeBooru, handleNotSafeBooru } = require('./handlers/handleBooru');
const { handleNhentaiInfo } = require('./handlers/handleNhentai');
const { handleEmojify } = require('./handlers/handleEmojify');
const { handleHelp, handleHelpReact } = require('./handlers/handleHelp');
const { malSearch } = require('./handlers/handleMAL');
const { handleStreamYoutube } = require('./handlers/handleStream');

const client = new Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', async (message: Message) => {
    let commandParams = message.content.toLowerCase().split(' ');
    let cleanMsg = commandParams.slice(2).join(' ');
    let ytLink = message.content.split(' ')[2];

    if (commandParams[0] === 'b!') {
        if (commandParams.length === 1)
            message.channel.send('Add a youtube link with \`play\` command!');
        handleStreamYoutube(message, commandParams, ytLink);
    }

    if (commandParams[0] === 'blek!') {
        switch (commandParams[1]) {
            case 'sfwbooru':
                handleSafeBooru(message, cleanMsg);
                break;
            case 'nsfwbooru':
                handleNotSafeBooru(message, cleanMsg);
                break;
            case '-h':
                handleHelpReact(message, commandParams);
                break;
            case 'emojify':
                handleEmojify(message, cleanMsg);
                break;
            case 'nhentai-info':
                await handleNhentaiInfo(message, cleanMsg);
                break;
            case 'mal-search':
                await malSearch(message, cleanMsg);
                break;
            case undefined:
                handleHelp(message);
                break;
            default:
                message.channel.send('What do you mean?');
                break;
        }
    } else if ((/.*t(m){2,}k.*/gi).test(message.content.replace(/\s/g, ''))) {
        message.channel.send('Jangan ada diskriminasi diantara kita');
    }
});

client.login(process.env.TOKEN).catch((e) => console.log(e));
