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
    var cleanMsgLower = event.content.toLowerCase().split(' ');
    var cleanMsg = event.content.split(' ');
    var cleanMsgLowerParams = pushJoinArray(cleanMsgLower);

    try {
        if (cleanMsgLower[0] === 'blek!') {
            if (cleanMsgLower[1] === 'sfwbooru') {
                handleSafeBooru(event, cleanMsgLowerParams);
            }
            else if (cleanMsgLower[1] === 'nsfwbooru') {
                handleNotSafeBooru(event, cleanMsgLowerParams);
            }
            else if (cleanMsgLower[1] === 'jadwal') {
                handleJadwalKuliah(event, cleanMsgLowerParams, pool);
            }
            else if (cleanMsgLower[1] === 'tugas-add') {
                let cleanMgsParams = pushJoinArray(cleanMsg);
                handleAddTugas(event, cleanMgsParams, pool);
            }
            else if (cleanMsgLower[1] === 'tugas-list') {
                handleListTugas(event, cleanMsgLowerParams, pool);
            }
            else if (cleanMsgLower[1] === 'tugas-delete') {
                handleDeleteTugas(event, cleanMsgLowerParams, pool);
            }
            else if (cleanMsgLower[1] === '-h') {
                handleHelpReact(event, cleanMsgLower);
            }
            else if (cleanMsgLower[1] === 'emojify') {
                handleEmojify(event, cleanMsgLowerParams);
            }
            else if (cleanMsgLower[1] === 'nhentai-info') {
                await handleNhentaiInfo(event, cleanMsgLowerParams);
            }
            else if (cleanMsgLower[1] === 'mal-search') {
                await malSearch(event, cleanMsgLowerParams);
            }
            else if (cleanMsgLower.length === 1) {
                handleHelp(event);
            }
            else {
                event.channel.send('What do you mean?');
            }
        } else if ((/.*t(m){2,}k.*/gi).test(event.content.replace(/\s/g, ''))) {
            event.channel.send('Jangan ada diskriminasi diantara kita');
        }
    } catch (e) {
        console.log(e);
    }
});

client.login(process.env.TOKEN).catch((e) => console.log(e));