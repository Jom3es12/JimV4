const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
var math = require('mathjs');

module.exports = class Math extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'math',
            group: 'math',
            memberName: 'math',
            description: 'Evaluate math.',
            examples: ['jim math 6905/2'],
            args: [{
                key: 'maths',
                label: 'string',
                prompt: 'What math am I evaluating?',
                type: 'string'
            }]

        });
    }

    async run(msg, args) {
        msg.channel.send(math.eval(args.maths));
    }
};