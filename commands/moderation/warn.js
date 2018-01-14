const modLog = require('../../tools/dbTools').modLog;
const dbt = require('../../tools/dbTools.js');
const commando = require('discord.js-commando');
const config = require('../../config.json');
const oneLine = require('common-tags').oneLine;
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const dbUrl = "mongodb://localhost:27017/jim";

module.exports = class warn extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            aliases: [],
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
        let member = args.member;
        let reason = args.reason;
        if (!msg.channel.permissionsFor(msg.author.id).has('KICK_MEMBERS')) return msg.reply('You don\'t have permission to do this.');
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
            }]
        };
        let warnNum;
        MongoClient.connect(dbUrl, function(err, db) {
            db.collection(`users`).findOne({ userId: `${member.user.id}` }, function(err, results) {
                console.log(results);
                warnNum = parseInt(results.warns) + 1;
                dbt.setUserData(member.user.id, { warns: warnNum.toString() });
            });
            db.close();
        });
        msg.channel.send(`${member.user.username}, you have been warned. \`${reason}\``);
        modLog(msg, { embed: embed });
    }
};