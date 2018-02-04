const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
var dbUrl = "mongodb://localhost:27017/jim";
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
module.exports = class setwelcomemessage extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'setleavemessage',
            aliases: ['changeleavemessage', 'clm', 'slm'],
            group: 'moderation',
            memberName: 'setleavemessage',
            description: 'Sets the leave message',
            details: oneLine `
                Set the message that appears when someone leaves your server. \`Use setLeaveMessage disable\` to disable the leave message. Use <<member>> in the message to say the member's name.
            `,
            examples: ['setLEaveMessage Say goodbye to <<member>>.'],

            args: [{
                key: 'message',
                label: 'message',
                prompt: 'What\'s the leave message? ',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(msg.author.id).has('ADMINISTRATOR') && msg.author.id != '144491485981704193') return msg.reply('You don\'t have permission to do this.');
        if (args.message == 'disable') {
            msg.channel.send('Disabled leave message');
        }
        const Guild = require('../../models/guildModel');
        Guild.findOne({ guildId: msg.guild.id }, function(err, doc) {
            doc.leaveMessage = args.message;
            doc.save();
        });
        if (args.message == 'disable') {
            msg.reply('Disabled the leave message.');
        } else {
            msg.reply(`Updated the leave message.`);
        }
    }
};