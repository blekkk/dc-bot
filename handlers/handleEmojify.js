module.exports = {
    handleEmojify: (client, message) => {

        let emojiMessage = [];
        let numEmojis = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:'];
        message = message.split('');

        message.forEach((msgChar) => {
            if ((/[a-zA-Z]/g).test(msgChar) === true) {
                emojiMessage.push(`:regional_indicator_${msgChar}:`);
            } else if ((/[0-9]/g).test(msgChar) === true) {
                emojiMessage.push(numEmojis[parseInt(msgChar)]);
            } else if ((/\s/g).test(msgChar) === true) {
                emojiMessage.push(' ');
            }
        });
        emojiMessage = emojiMessage.join(' ');
        client.channel.send(emojiMessage);
    }
}