const Discord = require('discord.js');
const Pool = require('pg').Pool
const {handleSafeBooru, handleNotSafeBooru} = require('./handlers/handleBooru');
const {handleNhentaiInfo} = require('./handlers/handleNhentai');
const {handleEmojify} = require('./handlers/handleEmojify');
const {handleHelp, handleHelpReact} = require('./handlers//handleHelp');
const {handleAddTugas, handleListTugas, handleDeleteTugas, handleJadwalKuliah} = require('./handlers/handleKuliahStuff');

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

client.on('message', async msg => {
    var cleanMsg = msg.content.toLowerCase().split(' ');
    var tugasMsg = msg.content.split(' ');
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
        if (cleanMsg[1] === 'jadwal') {
            handleJadwalKuliah(msg, booruParams, pool);
        }
        if (cleanMsg[1] === 'tugas-add') {
            let tugasParams = [];
            for (let i = 2; i < cleanMsg.length; i++) {
                tugasParams.push(tugasMsg[i]);
            }
            tugasParams = tugasParams.join(' ');
            handleAddTugas(msg, tugasParams, pool);
        }
        if (cleanMsg[1] === 'tugas-list') {
            handleListTugas(msg, booruParams, pool);
        }
        if (cleanMsg[1] === 'tugas-delete') {
            handleDeleteTugas(msg, booruParams, pool);
        }
        if (cleanMsg[1] === '-h') {
            handleHelpReact(msg, cleanMsg);
        }
        if (cleanMsg[1] === 'emojify') {
            handleEmojify(msg,booruParams);
        }
        if (cleanMsg[1] === 'nhentai-info') {
            await handleNhentaiInfo(msg,booruParams);
        }
        if (cleanMsg.length === 1) {
            handleHelp(msg);
        }
    }
});

client.login(`${process.env.TOKEN}`).catch((e) => console.log(e));