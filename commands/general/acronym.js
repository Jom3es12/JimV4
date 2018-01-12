const commando = require('discord.js-commando');

module.exports = class Cleverbot extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'acronym',
            aliases: ['acro'],
            group: 'general',
            guildOnly: false,
            memberName: 'acronym',
            description: 'Gives you the definition for an acronym',
            examples: ['jim acronym kogama'],
            args: [{
                key: 'acronym',
                label: 'acro',
                prompt: 'Which word did you want use?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const word = args.acronym;
        const acronym = require('acronym-maker');
        acronym.create(word, function(err, res) {
            msg.channel.send(res);
        });
    }
};