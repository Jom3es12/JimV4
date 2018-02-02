const modLog = require('../../tools/dbTools').modLog;
const dbt = require('../../tools/dbTools.js');
const commando = require('discord.js-commando');
const config = require('../../config.json');
const oneLine = require('common-tags').oneLine;
const moment = require('moment');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jim');
var db = mongoose.connection;
db.once('open', function() {});

module.exports = class warn extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            aliases: [],
            guildOnly: true,
            group: 'moderation',
            memberName: 'warn',
            description: 'Warn someone. ',
            details: oneLine `
                 Warns a user. Provide a reason after saying who you're warning.
            `,
            examples: ['warn Ag Being evil'],
            args: [{
                    key: 'member',
                    label: 'member',
                    prompt: 'Who is going to be warned?',
                    type: 'member',

                },
                {
                    key: 'reason',
                    label: 'reason',
                    prompt: 'What\'s the reason for the warn?',
                    type: 'string',
                }
            ]
        });
    }

    async run(msg, args) {
        const User = require('../../models/userModel');
        let member = args.member;
        let reason = args.reason;
        if (member.user.id == msg.client.user.id) return msg.reply('You can\'t warn me. I\'m just a robot.');
        if (!msg.channel.permissionsFor(msg.author.id).has('KICK_MEMBERS')) return msg.reply('You don\'t have permission to do this.');
        let warnNum = 0;
        User.findOne({ userId: member.user.id }, function(err, res) {
            console.log(res);
            warnNum = res.warns + 1;
            console.log(warnNum);
            var embed = {
                "title": "**Warned by: **",
                "description": msg.author.username,
                "color": 16730890,
                "timestamp": moment().format(),
                "footer": {
                    "icon_url": msg.client.user.avatarURL,
                    "text": "Jimbot"
                },
                "author": {
                    "name": member.user.username,
                    "icon_url": member.user.avatarURL,
                },
                "fields": [{
                    "name": "Reason",
                    "value": reason
                }, {
                    "name": "Total warns",
                    "value": `*${warnNum}*`
                }]
            };
            msg.channel.send(`${member.user.username}, you have been warned. \`${reason}\``);
            modLog(msg, { embed: embed });
            res.warns = warnNum;
            res.save();
        });

    }
};