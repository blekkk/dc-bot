const Discord = require('discord.js');
const Danbooru = require('danbooru');
const client = new Discord.Client();
const booru = new Danbooru();
const axios = require("axios");
const Pool = require('pg').Pool

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

const handleJadwalKuliah = (client, params) => {
    let dayToday = "null";
    let dayOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri'];
    let finalText = "";
    if (params.split(" ").length > 1) {
      client.channel.send("Please input just **one** day of the week!");
      return;
    }
    if (params.length === 0) {
      let date = new Date();
      dayToday = date.getDay();
    }
    if (params.match(/^mon|tue|wed|thu|fri$/g) && dayToday === "null") {
      params = params.replace(/"/g, "'");
      console.log(dayToday);
      finalText = finalText.concat(`Jadwal kuliah hari **${params}**:\n\n`);
      pool.query(`SELECT nama_kuliah,hari_kuliah,dosen,waktu_kuliah FROM public."Jadwal_Kuliah" WHERE hari_kuliah = '${params}' ORDER BY id ASC `, (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
          console.log(finalText);
          console.log(row);
          finalText = finalText.concat(`**Nama MK**: ${row.nama_kuliah}\n**Dosen**: ${row.dosen}\n**Waktu Kuliah**: ${row.waktu_kuliah}\n\n`);
        }
        client.channel.send(finalText);
      })
    } else if (dayToday !== "null" && params.length === 0) {
      dayToday = dayOfWeek[dayToday - 1];
      dayToday = dayToday.replace(/"/g, "'");
      console.log(dayToday);
      finalText = finalText.concat(`Jadwal kuliah hari ini(**${dayToday}**):\n\n`);
      pool.query(`SELECT nama_kuliah,hari_kuliah,dosen,waktu_kuliah FROM public."Jadwal_Kuliah" WHERE hari_kuliah = '${dayToday}' ORDER BY id ASC `, (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
          console.log(finalText);
          console.log(row);
          finalText = finalText.concat(`**Nama MK**: ${row.nama_kuliah}\n**Dosen**: ${row.dosen}\n**Waktu Kuliah**: ${row.waktu_kuliah}\n\n`);
        }
        client.channel.send(finalText);
      })
    } else {
      client.channel.send("Please input the correct day (mon - fri)");
      return;
    }
  }

const handleNhentaiInfo = async (client, params) => {
    try {
        if (params.length === 0) {
            client.channel.send("Please enter the doujin id");
            return;
        }
        const result = await axios.get(`https://nhentai.net/api/gallery/${params}`);
        if (result.status != 404) {
            let listTags = []
            let listArtist = []
            let listParody = []
            let listCharacter = []
            result.data.tags.forEach((tagEach) => {
                switch (tagEach.type) {
                    case 'tag':
                        listTags.push(` ${tagEach.name}`);
                        break;
                    case 'artist':
                        listArtist.push(` ${tagEach.name}`);
                        break;
                    case 'parody':
                        listParody.push(` ${tagEach.name}`);
                        break;
                    case 'character':
                        listCharacter.push(` ${tagEach.name}`);
                        break;
                }
            })
            client.channel.send(
                `**id**: ${result.data.id}\n\n**title**: ${result.data.title.english}\n\n**Artist**:${listArtist}\n\n**Parody**:${listParody}\n\n**Character**:${listCharacter}\n\n**tags**:${listTags}\n\n**pages**: ${result.data.num_pages}\n\n**url**: https://nhentai.net/g/${result.data.id}/`
            );
        }
    } catch (e) {
        client.channel.send("Doujin not found");
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
                client.reply('we currently have 4 functions:\n\n\`sfwbooru\`, \n\`nsfwbooru\`,\n\`nhentai-info\`,\nand \`emojify\`\n\n type \`blek! -h <FUNCTION_NAME>\` for help');
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
    } else if (message[2] === 'emojify') {
        client.reply('emojify your messages!\n\nJust type \`blek emojify <YOUR_MESSAGES>\`');
    } else if (message[2] === 'nhentai-info') {
        client.reply('nhentai-info sends you information about the doujin with the given id\n\nExample: blek! nhentai-info 177013\n\nNote: nhentai-info only accepts **one** id');
    } else if (message[2] === 'jadwal') {
        client.reply('jadwal is a hidden function that sends you information about today\'s coolyeah schedule or a chosen day (mon-fri)\n\nExample:\n\`blek! jadwal\` (for today\'s schedule)\n\`blek! jadwal mon\` (for schedule on monday)');
    }
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
        if (cleanMsg[1] === 'jadwal') {
            handleJadwalKuliah(msg, booruParams);
        }
        if (cleanMsg[1] === '-h') {
            handleHelpReact(msg, cleanMsg);
        }
        if (cleanMsg[1] === 'emojify') {
            handleEmojify(msg,booruParams);
        }
        if (cleanMsg[1] === 'nhentai-info') {
            handleNhentaiInfo(msg,booruParams);
        }
        if (cleanMsg.length === 1) {
            handleHelp(msg);
        }
    }
});

client.login(`${process.env.TOKEN}`).catch((e) => console.log(e));