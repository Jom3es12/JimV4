const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class leet extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'leet',
            aliases: ['1337'],
            group: 'fun',
            memberName: 'leet',
            format: '<text>',
            description: 'converts your message to leetspeak',
            examples: ['leet Cool message'],
        });
    }

    async run(msg, args) {
        var leet = require("leet");
        var words = msg.content.split(' ');
        words = words.splice(2);
        words = words.join(` `);
        msg.channel.send(leet.convert(words));
    }
};