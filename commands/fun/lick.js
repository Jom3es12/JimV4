const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class lick extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'lick',
            aliases: [],
            group: 'fun',
            guildOnly: true,
            memberName: 'lick',
            description: 'lick someone',
            examples: ['jim lick codrew'],
            args: [{
                key: 'person',
                label: 'member',
                prompt: "Who are you licking?",
                type: 'member',
            }]
        });
    }

    async run(msg, args) {
        msg.delete();
        msg.channel.send(`_licks ${args.person.user.username}_`);
    }
};