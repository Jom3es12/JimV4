const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ws = require('wait-sync');
module.exports = class purge extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            aliases: ['del'],
            group: 'moderation',
            memberName: 'purge',
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
        if (msg.channel.permissionsFor(msg.author).has('MANAGE_MESSAGES')) {
            msg.delete();
            msg.channel.fetchMessages({
                limit: num
            }).then(messages => {
                let msgArr = messages.array();
                msgArr = msgArr.filter(function(mess) {
                    if (args.member) return mess.author.id === args.user.user.id;
                    else return true;
                });
                msg.channel.send(`You're about to delete ${args.num} ${args.num > 1 ? 'messages' : 'message'}, are you sure you want to do this? (yes/y)`).then(MSG => {
                    ws(5);
                    MSG.delete();
                });
                const filter = m => m.author.id == msg.author.id;
                msg.channel.awaitMessages(aMessage => msg.author.id === aMessage.author.id, { max: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        var stupid = collected.array()[0];
                        if (stupid.content.toLowerCase() == 'yes' || stupid.content.toLowerCase() == 'ye' || stupid.content.toLowerCase() == 'y') {
                            msg.channel.send(`Purged ${args.num} messages from ${msg.channel.name} ${args.user ? 'from ' + args.user.user.username : ''} `).then(MSG => {
                                ws(2);
                                MSG.delete();
                            });
                            msg.channel.bulkDelete(msgArr).catch(
                                msg.reply('You can\'t delete messages older than 14 days.')
                            );
                            stupid.delete();
                        } else {
                            msg.channel.send('Canceled the purge.').then(MSG => {
                                ws(2);
                                stupid.delete();
                            });
                        }
                    }).catch(() => {
                        msg.channel.send('Time up. Purge canceled.').then(MSG => {
                            ws(2);
                            MSG.delete();
                        });
                    });

            });
        } else {
            msg.channel.send('You are not allowed to do this.').then(MSG => {
                ws(2);
                MSG.delete();
            });
        }
    }
};

// I'm trying to figure out why I even bother.,