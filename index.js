const Discord = require('discord.js');
const Pool = require('pg').Pool
const { handleSafeBooru, handleNotSafeBooru } = require('./handlers/handleBooru');
const { handleNhentaiInfo } = require('./handlers/handleNhentai');
const { handleEmojify } = require('./handlers/handleEmojify');
const { handleHelp, handleHelpReact } = require('./handlers//handleHelp');
const { handleAddTugas, handleListTugas, handleDeleteTugas, handleJadwalKuliah } = require('./handlers/handleKuliahStuff');
const { malSearch } = require('./handlers/handleMAL');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const pushJoinArray = (arrayInput, i = 2) => {
    let arrayResult = [];
    for (i; i < arrayInput.length; i++) {
        arrayResult.push(arrayInput[i]);
    }
    return arrayResult = arrayResult.join(' ');
}

client.on('message', async event => {
    let cleanMsgLower = event.content.toLowerCase().split(' ');
    let cleanMsg = event.content.split(' ');
    let cleanMsgLowerParams = pushJoinArray(cleanMsgLower);

    if (cleanMsgLower[0] === 'blek!') {
        switch (cleanMsgLower[1]) {
            case 'sfwbooru':
                handleSafeBooru(event, cleanMsgLowerParams);
                break;
            case 'nsfwbooru':
                handleNotSafeBooru(event, cleanMsgLowerParams);
                break;
            case 'jadwal':
                handleJadwalKuliah(event, cleanMsgLowerParams, pool);
                break;
            case 'tugas-add':
                let cleanMgsParams = pushJoinArray(cleanMsg);
                handleAddTugas(event, cleanMgsParams, pool);
                break;
            case 'tugas-list':
                handleListTugas(event, cleanMsgLowerParams, pool);
                break;
            case 'tugas-delete':
                handleDeleteTugas(event, cleanMsgLowerParams, pool);
                break;
            case '-h':
                handleHelpReact(event, cleanMsgLower);
                break;
            case 'emojify':
                handleEmojify(event, cleanMsgLowerParams);
                break;
            case 'nhentai-info':
                await handleNhentaiInfo(event, cleanMsgLowerParams);
                break;
            case 'mal-search':
                await malSearch(event, cleanMsgLowerParams);
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
