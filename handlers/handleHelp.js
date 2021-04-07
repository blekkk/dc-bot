module.exports = {
    handleHelp: (client) => {
        client.reply('do you need any help?').then( (r) => {
            r.react('✅');
    
            const filter = (reaction, user) => {
            return ['✅'].includes(reaction.emoji.name) && user.id === client.author.id;
            };
    
            r.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
    
                if (reaction.emoji.name === '✅') {
                    client.reply(
                        `we currently have 5 functions:\n\n\`sfwbooru\`,\n\`nsfwbooru\`,\n\`nhentai-info\`,\n\`mal-search\`,\nand \`emojify\`\n\ntype \`blek! -h <FUNCTION_NAME>\` for help`
                    );
                }
            })
            .catch(collected => {
                console.log("The person doesn't respond");
            });
        });
    },
    
    handleHelpReact: (client, message) => {
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
        } else if (message[2] === 'tugas') {
            client.reply('the hidden tugas family functions, use it to add, list, and delete your tugas. Here\'s how to use it:\n\nAdd your tugas:\n\`blek! tugas-add "<MATA_KULIAH>" "<DETAIL_TUGAS>" "<DEADLINE_TUGAS>"\`\nList your tugas:\n\`blek! tugas-list\`\nDelete your tugas:\n\`blek! tugas-delete <NOMOR_TUGAS_PADA_LIST>\`');
        } else if (message[2] === 'mal-search') {
            client.reply(`mal-search displays information about the searched anime on MyAnimeList\n\njust type:\n\`blek! mal-search <YOUR_SEARCH_QUERY>\``);
        }
    }
}