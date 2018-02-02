const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
const dbUrl = "mongodb://localhost:27017/jim";
const modlog = require('../../tools/dbTools').modLog;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
module.exports = class setmodrole extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'setmodrole',
            aliases: ['smr'],
            group: 'moderation',
            memberName: 'setmodrole',
            description: 'Sets the welcome channel',
            details: oneLine `
                Sets the mod role. Case sensitive! It's \`Moderator\` by default.
            `,
            examples: ['setModRole mod', 'smr moderator'],

            args: [{
                key: 'role',
                label: 'role',
                prompt: 'What\'s the name of the role?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(msg.author.id).has('ADMINISTRATOR') && msg.author.id != '144491485981704193') return msg.reply('You don\'t have permission to do this.');
        const Guild = require('../../models/guildModel');
        Guild.findOne({ guildId: msg.guild.id }, function(err, doc) {
            doc.modRole = args.role;
            doc.save();
        });
        msg.reply(`Set modrole to ${args.role}.`);
    }
};