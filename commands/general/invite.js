const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const moment = require('moment');
var timestamp = new Date();
timestamp.toISOString();
module.exports = class invite extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: ['inv'],
            group: 'general',
            memberName: 'invite',
            description: 'Gives the invite link.',
            details: oneLine `         
            `,
            examples: ['jim invite'],
        });
    }

    async run(msg, args) {
        const embed = {
            "title": "**Invite**",
            "url": 'http://jom3.es/jim',
            "description": 'Invite me to your server!',
            "color": 1703737,
            "timestamp": timestamp,
            "author": {
                "icon_url": msg.client.user.avatarURL,
                "text": "Jimbot"
            }
        };
        msg.channel.send('', { embed: embed });
    }
};