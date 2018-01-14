const commando = require('discord.js-commando');

module.exports = class avatar extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            group: 'general',
            memberName: 'avatar',
            description: 'get the avatar url of a user. If getting a user from a different server, use their ID.',
            examples: ['avatar user'],
            args: [{
                key: 'user',
                label: 'user',
                prompt: 'What user are you talking about?',
                type: 'user'
            }]
        });
    }

    async run(msg, args) {
        msg.reply(args.user.avatarURL).catch(e => {
            msg.reply('This is a default avatar.');
        });
    }
};