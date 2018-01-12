const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');

module.exports = class usage extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'usage',
            group: 'general',
            memberName: 'usage',
            description: 'Gives you the command usage for the provide command ',
            guildOnly: false,
            args: [{
                key: 'command',
                label: 'command',
                prompt: 'what command are you looking up?',
                type: 'string'
            }]
        });
    }

    async run(msg) {
        msg.channel.send(msg.guild.commandUsage(args.command));
    }
};