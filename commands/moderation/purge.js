const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ws = require('wait-sync');
const modLog = require('../../tools/dbTools').modLog;

module.exports = class purge extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            aliases: ['del'],
            group: 'moderation',
            memberName: 'purge',
            guildOnly: true,
            description: 'Deletes a bunch of messages, moderators only.',

            args: [{
                    key: 'num',
                    label: 'amount',
                    prompt: 'How many messages are going to be deleted.',
                    type: 'integer',

                },
                {
                    key: 'user',
                    label: 'user',
                    prompt: "Who's message's are getting purged?",
                    type: 'user',
                    default: ''

                }
            ]

        });
    }

    async run(msg, args) {
        const num = args.num;
        if (num > 100) return msg.channel.send('Number must be less than 100.');
        if (num <= 1) return msg.channel.send('You can\'t delete nothing.');
        if (!msg.channel.permissionsFor(msg.client.user).has('MANAGE_MESSAGES')) return msg.channel.send('I can\'t delete messages in this channel');
        if (!msg.channel.permissionsFor(msg.author).has('MANAGE_MESSAGES')) {
            msg.channel.send('You are not allowed to do this.').then(MSG => {
                modLog(msg, `${msg.author.tag} tried to purge ${num} messages in <#${msg.channel.id}> but wasn't allowed to.`);
                ws(2);
                MSG.delete();
            });
        }
        msg.delete();
        msg.channel.send(`You're about to delete ${args.num} ${args.num > 1 ? 'messages' : 'message'} ${args.user ? 'from ' + args.user.username : ''}, are you sure you want to do this? (yes/y)`).then(MSG => {
            ws(2);
            MSG.delete();
        });

        msg.channel.awaitMessages(aMessage => msg.author.id === aMessage.author.id, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                let messages;

                var stupid = collected.array()[0];
                if (stupid.content.toLowerCase() == 'yes' || stupid.content.toLowerCase() == 'ye' || stupid.content.toLowerCase() == 'y') {
                    msg.channel.send(`Purged ${args.num} messages from ${msg.channel.name} ${args.user ? 'from ' + args.user.username : ''} `).then(MSG => {
                        ws(2);
                        MSG.delete();
                    });
                    stupid.delete();
                    if (args.user) {
                        const filter = m => m.author.id === args.user.id;
                        msg.channel.fetchMessages({
                            limit: num
                        }).then(MESSAGES => {
                            let msgs = MESSAGES.filter(filter);
                            msg.channel.bulkDelete(msgs);
                            modLog(msg, `${msg.author.tag} purged ${args.num} messages from ${msg.channel.name}${args.user ? ' from ' + args.user.username  + '.': '.'}`)
                        });
                    } else {
                        msg.channel.fetchMessages({
                            limit: num
                        }).then(MESSAGE => {
                            let msgarr = MESSAGE.array();
                            msg.channel.bulkDelete(msgarr);
                            modLog(msg, `${msg.author.tag} purged ${args.num} messages from ${msg.channel.name}${args.user ? ' from ' + args.user.username  + '.': '.'}`)
                        });
                    }
                } else {
                    msg.channel.send('Canceled the purge.').then(MSG => {
                        ws(5);
                        stupid.delete();
                    });
                }
            }).catch(e => {
                msg.channel.send(e.toString().replace('DiscordAPIError: ', '')).then(MSG => {
                    ws(2);
                    MSG.delete();
                });
            });



    }
};

// I'm trying to figure out why I even bother.,