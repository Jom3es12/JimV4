const stripIndents = require('common-tags').stripIndents;
const commando = require('discord.js-commando');
const Canvas = require('canvas');
module.exports = class UserInfoCommand extends commando.Command {
        constructor(client) {
            super(client, {
                name: 'user-info',
                aliases: ['user'],
                group: 'util',
                memberName: 'user-info',
                description: 'Gets information about a user.',
                examples: ['user-info @Gingyr#3042', 'user-info Ag'],
                guildOnly: true,

                args: [{
                    key: 'member',
                    label: 'user',
                    prompt: 'What user would you like to snoop on?',
                    type: 'member'
                }]
            });
        }

        async run(msg, args) {
                if (!msg.channel.permissionsFor(msg.client.user).hasPermission('ATTACH_FILES')) {
                    return msg.channel.send("I can't attach files in this channel.");
                }
                const member = args.member;
                const user = member.user;
                const Image = Canvas.Image;
                const canvas = new Canvas(450, 175);
                const ctx = canvas.getContext('2d');
                // main bg
                ctx.fillStyle = `#1565c0`;
                ctx.fillRect(0, 0, 450, 200);
                // title bar 
                ctx.fillStyle = '#003c8f';
                ctx.fillRect(0, 0, 450, 17);
                ctx.font = 'small-caps bold 12px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`Info on ${user.tag} (ID: ${user.id})`, 5, 13);
                // body 
                ctx.font = 'bold 13px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`❯ Member Details`, 5, 32);
                ctx.font = '13px sans-serif';
                ctx.fillText(`${member.nickname !== null ? `• Nickname: ${member.nickname}` : '• No nickname'}`, 8, 47);
            ctx.fillText(`• Roles: ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}`, 8, 62);
            ctx.font = 'bold 13px sans-serif';
            ctx.fillText(`❯ User Details`, 5, 77);
            ctx.font = '12px sans-serif';
            ctx.fillText(`• Created at: ${user.createdAt}`, 8, 92);

            ctx.fillText(`• Status: ${user.presence.status}`, 8, 107);
            ctx.fillText(`• Game: ${user.presence.game != null ? user.presence.game.name : 'None'}`, 8, 122);
            if(this.client.isOwner(user.id)) {
                ctx.fillText('• Is an admin of this bot.', 8, 137);
            }
            if (user.bot) {
                ctx.fillStyle = '#ff0000';
                ctx.fillText('• Is a robot.', 8, 152);
            }
            if (user.id == '144491485981704193') {
                ctx.fillStyle = '#ff7043';
                ctx.fillText('• Is the creator of this bot.', 8, 152);
            } 
            if (user.id == '147508587382439937') {
                ctx.fillStyle = '#78909c';
                ctx.fillText('• Is the great jatsu!.', 8, 152);
            }
            // send
            msg.channel.send('', { files: [{ attachment: canvas.toBuffer(), name: 'user-info.png' }] });
    }
};