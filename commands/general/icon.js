const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class changeme extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'icon',
            group: 'general',
            memberName: 'fun',
            description: 'Gives you the link to the server icon',
            examples: ['jim icon'],
        });
    }

    async run(msg, args) {
        try {
            msg.channel.send(msg.guild.iconURL);
        } catch (x) {
            msg.channel.send('This guild doesn\'t have an icon.');
        }
    }
};