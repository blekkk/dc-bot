const { helpData } = require('../datasource/const');

module.exports = {
    handleHelp: async (client) => {
        try {
            const r = await client.reply('Do you need any help?');
            r.react('✅');

            const filter = (reaction, user) => {
                return ['✅'].includes(reaction.emoji.name) && user.id === client.author.id;
            };

            const collected =  await r.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] });
            const reaction = collected.first();

            if (reaction.emoji.name === '✅') {
                client.reply(
                    `we currently have 5 functions:\n\n\`sfwbooru\`,\n\`nsfwbooru\`,\n\`nhentai-info\`,\n\`mal-search\`,\n\`songs\`,\nand \`emojify\`\n\ntype \`blek! -h <FUNCTION_NAME>\` for help`
                );
            }

        } catch (error) {
            console.log(error);
        }
    },

    handleHelpReact: (client, message) => {
        switch (message[2]) {
            case 'sfwbooru':
                client.reply(helpData.sfwbooru);
                break;
            case 'nsfwbooru':
                client.reply(helpData.nsfbooru);
                break;
            case 'emojify':
                client.reply(helpData.emojify);
                break;
            case 'nhentai-info':
                client.reply(helpData['nhentai-info']);
                break;
            case 'jadwal':
                client.reply(helpData.jadwal);
                break;
            case 'tugas':
                client.reply(helpData.tugas);
                break;
            case 'mal-search':
                client.reply(helpData['mal-search']);
                break;
            case 'songs':
                client.reply(helpData.songs);
                break;
            default:
                break;
        }
    },
}