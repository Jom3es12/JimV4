const commando = require('discord.js-commando');

module.exports = class face extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'face',
            group: 'fun',
            memberName: 'face',
            description: 'Sends a random cute face',
            examples: ['jim face'],
        });
    }

    async run(msg, args) {
        var face = require('cool-ascii-faces');
        msg.channel.send(face());
    }
};