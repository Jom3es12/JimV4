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
                const member = args.member,
                    user = member.user,
                    Image = Canvas.Image,
                    canvas = new Canvas(450, 200),
                    ctx = canvas.getContext('2d');

                // assign gradients to fill and stroke styles
                ctx.fillStyle = `#002B36`;
                ctx.strokeStyle = `#000`;

                // draw shapes
                ctx.fillRect(0, 0, 450, 200);
                ctx.strokeRect(0, 0, 450, 200);

                let theme = 'dark';
                let fontColor = '#93A1A1';
                ctx.font = '13px Consolas';
                ctx.scale(1, 1);
                ctx.patternQuality = 'billinear';
                ctx.filter = 'bilinear';
                ctx.antialias = 'subpixel';
                ctx.fillStyle = fontColor;
                var isJat = false;
                if (user.id == '147508587382439937') isJat = true;

                if (!msg.channel.permissionsFor(msg.client.user).hasPermission('ATTACH_FILES')) {
                    msg.channel.send("I can't send pictures in this channel, yell at an admin to allow me to attach files.");
                    msg.channel.send(`Info on ${user.tag} (ID: ${user.id}) \n 
❯ Member Details
 ${member.nickname !== null ? ` • Nickname: ${member.nickname}` : ' • No nickname'}
  • Roles: ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}
  • Joined at: ${member.joinedAt}
❯ User Details
  • Created at: ${user.createdAt}${user.bot ? '\n  • Is a bot account' : ''}
  • Status: ${user.presence.status}
  • Game: ${user.presence.game ? user.presence.game.name : 'None'}${user.id == '147508587382439937' ? '\n  • Is an amazing person <3' : ''}`)
}
else{
        ctx.fillText(`Info on ${user.tag} (ID: ${user.id}) \n 
❯ Member Details
 ${member.nickname !== null ? `  • Nickname: ${member.nickname}` : ' • No nickname'}
   • Roles: ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}
   • Joined at: ${member.joinedAt}
❯ User Details
   • Created at: ${user.createdAt}${user.bot ? '\n  • Is a bot account' : ''}
   • Status: ${user.presence.status}
   • Game: ${user.presence.game != null ? user.presence.game.name : 'None'}${this.client.isOwner(user.id) ? '\n   • Is an owner of this bot.' : ''}`, 5, 15);
        msg.channel.sendFile(canvas.toBuffer(), `user-info_for_${user.username}.png`);
	}
}
};