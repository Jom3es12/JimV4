const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
var dbUrl = "mongodb://localhost:27017/jim";
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
module.exports = class setwelcomemessage extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'setwelcomemessage',
            aliases: ['changewelcomemessage', 'cwm', 'swm'],
            group: 'moderation',
            memberName: 'setwelcomemessage',
            description: 'Sets the welcome message',
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
        if (msg.channel.permissionsFor(msg.author.id).has('ADMINISTRATOR')) return msg.reply('You don\'t have permission to do this.');
        if (args.message == 'disable') {
            return msg.channel.send('Disabled welcome message');
        }
        var query = { 'guildId': `${msg.guild.id}` };
        var values = { $set: { 'welcomeMessage': `${args.message}` } };
        MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
            db.collection("guilds").updateOne(query, values, function(err, res) {
                if (err) throw err;
                if (args.message == 'disable') {
                    msg.channel.send('disabled');
                    db.close();
                } else {
                    msg.channel.send(`Set welcome message to: \`${args.message}\``);
                    db.close();
                }

            });
        });

    }
};