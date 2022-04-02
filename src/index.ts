import { Client, Message } from 'discord.js';
import { handleSafeBooru, handleNotSafeBooru } from './handlers/handleBooru';
import { handleNhentaiInfo } from './handlers/handleNhentai'
import { handleEmojify } from './handlers/handleEmojify'
import { handleHelp, handleHelpReact } from './handlers/handleHelp';
import { malSearch } from './handlers/handleMAL';
import { handleStreamYoutube } from './handlers/handleStream';
import { discriminate } from './handlers/handleDiscriminate';

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
                await handleSafeBooru(message, cleanMsg);
                break;
            case 'nsfwbooru':
                await handleNotSafeBooru(message, cleanMsg);
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
                await handleHelp(message);
                break;
            default:
                message.channel.send('What do you mean?');
                break;
        }
    } else {
        discriminate(message, message.content.replace(/\s/g, ''));
    }
});

client.login(process.env.TOKEN).catch((e) => console.log(e));
