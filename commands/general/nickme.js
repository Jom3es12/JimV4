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
        member.setNickname(args.name).then(x => {
            msg.channel.send("Your nickname is now: " + args.name);
        }).catch(x => {
            msg.reply('I couldn\'t change your username. I may not have permission to');
        });
    }
};