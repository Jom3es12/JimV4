const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
var dbUrl = "mongodb://localhost:27017/jim";
const MongoClient = require('mongodb').MongoClient;

module.exports = class setwelcomemessage extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'setwelcomemessage',
            aliases: ['changewelcomemessage', 'cwm', 'swm'],
            group: 'moderation',
            memberName: 'setwelcomemessage',
            description: 'Sets the welcome message',
            format: "<message | disable>",
            details: oneLine `
                Set the message that appears when someone joins your server. \`Use setWelcomeMessage disable\` to disable the welcome message. Use <<member>> in the message to say the member's name.
            `,
            examples: ['setWelcomeMessage Hello <<member>>, welcome to our server. '],

            args: [{
                key: 'message',
                label: 'message',
                prompt: 'What\'s the welcome message? ',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(msg.author.id).has('ADMINISTRATOR') && msg.author.id != '144491485981704193') return msg.reply('You don\'t have permission to do this.');
        const Guild = require('../../models/guildModel');
        Guild.findOne({ guildId: msg.guild.id }, function(err, doc) {
            doc.welcomeMessage = args.message;
            doc.save();
        });
        if (args.message == 'disable') {
            msg.reply('Disabled the welcome message.');
        } else {
            msg.reply(`Updated the welcome message.`);
        }
    }
};