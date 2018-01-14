const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class define extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'define',
            aliases: ['dictionary'],
            group: 'util',
            memberName: 'define',
            description: 'Gives you the definition of the provided word.',
            details: oneLine `
                  Searches http://Dictionary.com for the word you provided.
            `,
            examples: ['define lyrical'],

            args: [{
                key: 'word',
                label: 'word',
                prompt: 'What word will you define?',
                type: 'string',
            }]
        });
    }

    async run(msg, args) {
        function getDefinition(text) {
            var definit = require("define-word").define(text)
            var buff = "";
            if (definit.definitions.length < 1) return msg.channel.sendMessage('No definition for this word');
            else {
                buff += text + " is a " + definit.type + "\n";
                for (var i = 0; i < definit.definitions.length; i++) {
                    buff += i + 1 + ". " + definit.definitions[i] + "\n";
                }
                return buff;
            }
        }
        msg.channel.send(getDefinition(args.word));

    }
};