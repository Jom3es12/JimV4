const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const moment = require('moment');
var timestamp = new Date();
timestamp.toISOString();
module.exports = class invite extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: ['inv', 'info'],
            group: 'general',
            memberName: 'invite',
            description: 'Gives the invite link.',
            examples: ['invite'],
        });
    }

    async run(msg, args) {
        const embed = {
            "title": "**JimBot**",
            "color": 1703737,
            "timestamp": timestamp,
            "fields": [{
                "name": 'Info',
                "value": '**[Invite me to your server!](http://jom3.es/jim)** \n[Support Server Link](https://discord.gg/zfCx4X2)'
            }],
            "author": {
                "icon_url": msg.client.user.avatarURL,
                "text": "Jimbot"
            }
        };
        msg.channel.send('', { embed: embed });
    }
};