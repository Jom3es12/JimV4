const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
var math = require('mathjs');

module.exports = class Simplify extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'simplify',
            aliases: [],
            group: 'math',
            memberName: 'simplify',
            description: 'Simplify expressions',
            details: oneLine `
                  Simplify mathmatical expressions using math.js 
            `,
            examples: ['math 6905i/2 + 98'],
            args: [{
                key: 'maths',
                label: 'string',
                prompt: 'What math am I simplifying?',
                type: 'string'
            }]

        });
    }

    async run(msg, args) {
        msg.channel.send(math.simplify(args.maths).toString());
    }
};