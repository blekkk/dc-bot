module.exports = {
    handleEmojify: (client, message) => {
    
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
}