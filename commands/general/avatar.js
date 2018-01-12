const commando = require('discord.js-commando');

module.exports = class avatar extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            group: 'general',
            memberName: 'avatar',
            description: 'get the avatar of a user',
            examples: ['avatar @rubix'],
            args: [{
                key: 'user',
                label: 'user',
                prompt: 'What user are you talking about?',
                type: 'user'
            }]
        });
    }

    async run(msg, args) {
        try {
            msg.reply(args.user.avatarURL);
        } catch (x) {
            msg.reply('This avatar is a default avatar.');
        }
    }
};