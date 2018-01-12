const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
const apiai = require('apiai');
const app = apiai("ef1a3c0bd55a4635b20c0c07335f157d");
const muteEmitter = require('../../events/eventBus').muteEmitter;

module.exports = class mute extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: [],
            group: 'moderation',
            memberName: 'mute',
            description: 'A command to mute users.',
            guildOnly: true,
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
                    type: 'string',
                    default: 'none'
                }
            ]
        });
    }

    async run(msg, args) {
        const guild = msg.guild;
        const roles = msg.guild.roles;
        const member = args.member;
        const muteTime = args.time;
        console.log(muteTime);
        const channel = msg.channel;
        console.log('command run ' + channel.name);
        if (!guild.members.get(msg.author.id).hasPermission('KICK_MEMBERS')) {
            return channel.send('You don\'t have the proper perms.');
        }
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
            //  if (member.highestRole.calculatedPosition >= msg.guild.members.get(msg.author.id).highestRole.calculatedPosition) return channel.send('This user is higher than you.');
            // parse the time   
            var apiOptions = {
                sessionId: msg.author.id
            };
            const apiai = require('apiai');
            const app = apiai(config.diagflowToken);
            var request = app.textRequest(args.time, apiOptions);

            request.on('response', function(response) {

                var intent = response.result.metadata.intentName;
                var resolvedTime = response.result.parameters.duration;
                var responseText = response.result.fulfillment.speech;
                if (intent == 'time') {

                    var timeAmount = resolvedTime.amount;
                    console.log(timeAmount);
                    var timeUnit = resolvedTime.unit;
                    console.log(timeUnit);
                    if (timeUnit == 'ms') {
                        return channel.send("Please don't use ms.");
                    }
                    if (timeUnit == 's');
                    if (timeUnit == 'min') timeAmount = timeAmount * 60;
                    if (timeUnit == 'h') timeAmount = timeAmount * 3600;
                    if (timeUnit == 'day') timeAmount = timeAmount * 86400;
                    if (timeUnit == 'wk') timeAmount = timeAmount * 604800;
                    if (timeAmount > 604800) return channel.send('Time must be 1 week or shorter.');
                    var endTime = Date.now() + timeAmount * 1000;
                    var muteData = {
                        userId: `${member.user.id}`,
                        endTime: endTime,
                        guildId: `${guild.id}`
                    };
                    // emit newMute with the mute data
                    console.log(muteData);
                    channel.send(`Muted ${member.user.username} for ${resolvedTime.amount}${timeUnit}`);
                    muteEmitter.emit('newMute', muteData);
                } else {
                    return channel.send('I don\'t understand the mute time.');
                }
            });
            request.end();
        }
    }
};