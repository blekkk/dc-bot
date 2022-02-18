import { Message } from 'discord.js';

const handleEmojify = (client: Message, text: string): void => {

    let emojiMessage: string[] = [];
    let numEmojis = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:'];
    let arrayText = text.split('');

    arrayText.forEach((msgChar) => {
        if ((/[a-zA-Z]/g).test(msgChar) === true) {
            emojiMessage.push(`:regional_indicator_${msgChar}:`);
        } else if ((/[0-9]/g).test(msgChar) === true) {
            emojiMessage.push(numEmojis[parseInt(msgChar)]);
        } else if ((/\s/g).test(msgChar) === true) {
            emojiMessage.push(' ');
        }
    });
    const finalemojiMessage = emojiMessage.join(' ');
    client.channel.send(finalemojiMessage);
}

export { handleEmojify };