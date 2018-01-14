const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const clock = require('node-emoji-clock');
const moment = require('moment');
const mTime = moment();

module.exports = class clocl extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'clock',
            aliases: ['time'],
            group: 'general',
            memberName: 'clock',
            description: 'Tells you the time!',
            examples: ['clock', 'time'],
        });
    }

    async run(msg, args) {
        msg.channel.send(clock.timeToEmoji(mTime));
        msg.channel.send(mTime.toString());
    }
};