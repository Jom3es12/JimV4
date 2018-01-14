const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class changeme extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'icon',
            group: 'general',
            guildOnly: true,
            memberName: 'fun',
            description: 'Gives you the link to the server icon.',
            examples: ['icon'],
        });
    }

    async run(msg, args) {
        msg.channel.send(msg.guild.iconURL).catch(e => {
            msg.reply('This server doesn\'t have an icon.');
        });
    }
};