const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
module.exports = class nickMe extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'nickme',
            aliases: ['nick', 'name'],
            group: 'general',
            memberName: 'nickme',
            description: 'set your nickname',
            throttling: {
                usages: 3,
                duration: 100000
            },
            args: [{
                key: 'name',
                label: 'nickname',
                prompt: 'What do you want your name to be?',
                type: 'string',
                infinite: false
            }]
        });
    }

    async run(msg, args) {
        const member = msg.guild.member(msg.author.id);
        try {
            member.setNickname(args.name);
            msg.channel.send("Your nickname is now: " + args.name);
        } catch (x) {
            msg.reply('I can\'t do this, I may not have permission to.');
        }
    }
};