import { Message } from 'discord.js';

module.exports = {
  handleEmojify: (client: Message, text: String) => {

      let emojiMessage: Array<String> = [];
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
}