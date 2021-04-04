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

const connectionString = 'postgres://joxezgvzhckvgg:e85dc67e5f553d458de591e5dbc4d3f3c89748ad1cafce0ce4817fe251bf6eef@ec2-54-167-168-52.compute-1.amazonaws.com:5432/dehto6su2gf952';

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

    try {
        if (cleanMsg[0] === 'blek!') {
            if (cleanMsg[1] === 'sfwbooru') {
                handleSafeBooru(msg, booruParams);
            }
            else if (cleanMsg[1] === 'nsfwbooru') {
                handleNotSafeBooru(msg, booruParams);
            }
            else if (cleanMsg[1] === 'jadwal') {
                handleJadwalKuliah(msg, booruParams, pool);
            }
            else if (cleanMsg[1] === 'tugas-add') {
                let tugasParams = [];
                for (let i = 2; i < cleanMsg.length; i++) {
                    tugasParams.push(tugasMsg[i]);
                }
                tugasParams = tugasParams.join(' ');
                handleAddTugas(msg, tugasParams, pool);
            }
            else if (cleanMsg[1] === 'tugas-list') {
                handleListTugas(msg, booruParams, pool);
            }
            else if (cleanMsg[1] === 'tugas-delete') {
                handleDeleteTugas(msg, booruParams, pool);
            }
            else if (cleanMsg[1] === '-h') {
                handleHelpReact(msg, cleanMsg);
            }
            else if (cleanMsg[1] === 'emojify') {
                handleEmojify(msg,booruParams);
            }
            else if (cleanMsg[1] === 'nhentai-info') {
                await handleNhentaiInfo(msg,booruParams);
            }
            else if (cleanMsg.length === 1) {
                handleHelp(msg);
            } else {
                msg.channel.send('What do you mean?');
            }
        }
    } catch (e) {
        console.log(e);
    }
});

client.login(`Nzg5MTcyNTI3NTY5MzA1NjEw.X9uMMA.kyohUZf_cc_hEDVgXqem_zaFrjU`).catch((e) => console.log(e));