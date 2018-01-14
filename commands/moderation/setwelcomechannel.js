const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
const dbUrl = "mongodb://localhost:27017/jim";
const modlog = require('../../tools/dbTools').modLog;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
module.exports = class setwelcomechannel extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'setwelcomechannel',
            aliases: ['changewelcomechannel', 'cwc', 'swc'],
            group: 'moderation',
            memberName: 'setwelcomechannel',
            description: 'Sets the welcome channel',
            details: oneLine `
                Set the channel where your welcome messages will appear. The channel is set to mod-log by default.
            `,
            examples: ['setWelcomeChannel mod-log'],

            args: [{
                key: 'channel',
                label: 'channel',
                prompt: 'What channel are you setting as the welcome channel.',
                type: 'channel'
            }]
        });
    }

    async run(msg, args) {
        if (msg.channel.permissionsFor(msg.author.id).has('ADMINISTRATOR')) return msg.reply('You don\'t have permission to do this.');
        var query = { 'guildId': `${msg.guild.id}` };
        var values = { $set: { 'welcomeChannel': `${args.channel.name}` } };
        if (!msg.guild.channels.find("name", args.channel))
            MongoClient.connect(dbUrl, function(err, db) {
                if (err) throw err;
                db.collection("guilds").updateOne(query, values, function(err, res) {
                    if (err) throw err;
                    msg.channel.send(`Set channel to: \`${args.channel.name}\``);
                    db.close();
                });
            });

    }
};