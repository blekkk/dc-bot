import { Message } from "discord.js";

interface discriRegex {
  regex: RegExp,
  message: string
}

interface discriRegexes extends Array<discriRegex>{};

const discriRegexes: discriRegexes = [
  {
    regex: /.*t(m){2,}k.*/gi,
    message: 'Jangan ada diskriminasi diantara kita'
  },
  {
    regex: /.*<@!590295443641073800>.*/gi,
    message: 'Kay lagi ngehent?',
  },
  {
    regex: /.*<@!401533788833972224>.*/gi,
    message: 'Akbar goblok',
  },
  {
    regex: /.*<@!386674745426444300>.*/gi,
    message: 'Azhar sus',
  }
];

const discriminate = (client: Message, message: string) => {
  discriRegexes.map((item) => {
    if((item.regex).test(message)) {
      client.channel.send(item.message);
    }
  });
};

export {discriminate}