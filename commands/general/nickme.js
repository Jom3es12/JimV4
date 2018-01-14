const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
module.exports = class nickMe extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'nickme',
            aliases: ['nick', 'name'],
            group: 'general',
            memberName: 'nickme',
            description: 'Change your nickname for this server',
            throttling: {
                usages: 3,
                duration: 3600000
            },
            args: [{
                key: 'name',
                label: 'nickname',
                prompt: 'What do you want your nickname to be?',
                type: 'string',
            }]
        });
    }

    async run(msg, args) {
        const member = msg.guild.member(msg.author.id);
        if (!msg.channel.permissionsFor(msg.client.user).has('MANAGE_NICKNAMES')) return msg.channel.send('I don\'t have permission to change your nickname.');
        member.setNickname(args.name);
    }
};