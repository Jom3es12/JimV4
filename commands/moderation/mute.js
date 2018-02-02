const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
const modLog = require('../../tools/dbTools').modLog;
const muteEmitter = require('../../events/muteEmitter.js').muteEmitter;
const moment = require('moment');
var parseDuration = require(`duration-parser`);

module.exports = class mute extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: [],
            group: 'moderation',
            memberName: 'mute',
            description: 'A command to mute users.',
            guildOnly: true,
            format: '<member> <duration>',
            details: oneLine `
                
            `,
            examples: ['mute jimmyboy 4m'],

            args: [{
                    key: 'member',
                    label: 'user',
                    prompt: 'Who are you muting?',
                    type: 'member'
                },
                {
                    key: 'time',
                    label: 'time',
                    prompt: 'How long are they being muted?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const guild = msg.guild;
        const roles = msg.guild.roles;
        const member = args.member;
        const muteTime = args.time;
        const channel = msg.channel;
        if (!msg.channel.permissionsFor(msg.author.id).has('KICK_MEMBERS')) return msg.reply('You don\'t have permission.');

        if (!roles.find('name', 'jimmute')) { // make role if doesn't exist also set channel overwrites.
            if (!guild.members.get(msg.client.user.id).hasPermission('MANAGE_ROLES')) {
                channel.send('The `jimmute` role doesn\'t exist. I would make it, but I don\'t have permission.');
            } else {
                channel.send('I couldn\'t find the `jimmute` role, so I\'ll make it for you. Please wait...');
                guild.createRole({
                    name: 'jimmute'
                });
                const ws = require('wait-sync');
                ws(5);
                const overwriteOptions = {
                    'SEND_MESSAGES': false,
                };
                msg.guild.channels.forEach(chan => {
                    chan.overwritePermissions(msg.guild.roles.find('name', 'jimmute'), overwriteOptions);
                });
                channel.send('Success! Please try to mute again.');
            }
        } else { // the role already exists, so let's mute the user.
            if (msg.guild.members.get(msg.author.id).highestRole.calculatedPosition < args.member.highestRole.calculatedPosition) {
                return msg.channel.send('This member is higher than you.');
            }
            let endTime;
            try {
                endTime = Date.now() + parseDuration(muteTime);
            } catch (error) {
                return msg.reply('Not a valid time format.');
            }

            var muteData = {
                userId: `${member.user.id}`,
                endTime: endTime,
                guildId: `${guild.id}`
            };
            // emit newMute with the mute data
            muteEmitter.emit('newMute', muteData);
            var embed = {
                "title": "**Muted by: **",
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
                    "name": "Mute Time",
                    "value": `${muteTime}`
                }]
            };
            channel.send(`Muted ${member.user.username} for ${muteTime}`);
            modLog(msg, { embed: embed });
        }
    }
};