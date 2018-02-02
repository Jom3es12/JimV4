const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
const PersistentCollection = require('djs-collection-persistent');
var dbUrl = "mongodb://127.0.0.1:27017/jim";
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
module.exports = class setLog extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'setlog',
            aliases: [],
            group: 'moderation',
            memberName: 'setlog',
            description: 'Use this command to set the log channel.',
            guildOnly: true,
            details: oneLine `
                  This command sets the log channel.
            `,
            examples: ['setLog mod-log'],

            args: [{
                key: 'channel',
                label: 'channel',
                prompt: 'What\'s the name of the channel you are setting as your mod log channel.',
                type: 'channel',
                infinite: false
            }]
        });
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(msg.author.id).has('ADMINISTRATOR') && msg.author.id != '144491485981704193') return msg.reply('You don\'t have permission to do this.');
        const Guild = require('../../models/guildModel');
        Guild.findOne({ guildId: msg.guild.id }, function(err, doc) {
            doc.modLogChannel = args.channel.name;
            doc.save();
        });
        msg.reply(`Set log channel to ${args.channel}`);
    }
};