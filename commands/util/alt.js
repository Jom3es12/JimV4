const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class Alt extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'alt',
            group: 'util',
            memberName: 'alt',
            description: 'Turn alt codes into characters',
            examples: ['alt 0169'],

            args: [{
                key: 'code',
                label: 'alt code',
                prompt: ' prompt',
                type: 'integer',
                infinite: true
            }]
        });
    }

    async run(msg, args) {
        msg.channel.send(String.fromCharCode(args.code))
    }
};