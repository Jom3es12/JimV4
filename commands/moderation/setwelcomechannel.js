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
        if (!msg.channel.permissionsFor(msg.author.id).has('ADMINISTRATOR') && msg.author.id != '144491485981704193') return msg.reply('You don\'t have permission to do this.');
        const Guild = require('../../models/guildModel');
        Guild.findOne({ guildId: msg.guild.id }, function(err, doc) {
            doc.welcomeChannel = args.channel.name;
            doc.save();
        });
        msg.reply(`Set welcome channel to ${args.channel}`);
    }
};