const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
const net = require('net');
const { registerFont, createCanvas } = require('canvas');
registerFont('/home/jom3es12/JimV4/fonts/minecraftia.ttf', { family: 'minecraft' });

module.exports = class LookUpMinecraftServer extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'mcserver',
            aliases: ['minecraftserver', 'lookupmcserver'],
            group: 'util',
            memberName: 'mcserver',
            description: 'Lookup the info for the provided minecraft server',
            guildOnly: false,
            examples: ['mcserver play-shadowhaven.com', 'minecraftserver 120.123.123.123:6905'],

            args: [{
                key: 'address',
                label: 'address',
                prompt: 'What\'s the server address for the Minecraft server you\'re looking up?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let [address, port] = args.address.split(`:`);
        if (!port) port = 25565;

        let NUM_FIELDS = 6,
            status = null,
            current_players = null,
            version = null,
            motd = null,
            max_players = null;

        const mcClient = net.connect(parseInt(port), address, () => {
            var buff = new Buffer([0xFE, 0x01]);
            mcClient.write(buff);
        });
        mcClient.setTimeout(5000);

        mcClient.on('data', (data) => {
            if (data != null && data != '') {
                var server_info = data.toString().split("\x00\x00\x00");
                if (server_info != null && server_info.length >= NUM_FIELDS) {
                    status = 'Online!';
                    version = server_info[2].replace(/\u0000/g, '');
                    motd = server_info[3].replace(/\u0000/g, '');
                    current_players = server_info[4].replace(/\u0000/g, '');
                    max_players = server_info[5].replace(/\u0000/g, '');
                    var canvas = createCanvas(400, 100),
                        ctx = canvas.getContext('2d');
                    // main bg
                    ctx.fillStyle = `#633b18`;
                    ctx.fillRect(0, 0, 400, 100);
                    // title bar
                    ctx.fillStyle = '#2d7c27';
                    ctx.fillRect(0, 0, 400, 17);
                    ctx.font = '13px minecraft';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(args.address, 5, 13);
                    // body text
                    ctx.font = '12px minecraft';
                    ctx.scale(1, 1);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`• ${status}`, 5, 32);
                    ctx.fillText(`• Version: ${version}`, 5, 47);
                    ctx.fillText(`• MOTD: ${motd}`, 5, 62);
                    ctx.fillText(`• Playing: ${current_players}`, 5, 77);
                    ctx.fillText(`• Max Players: ${max_players}`, 5, 92);
                    // send image
                    msg.channel.send('', { files: [{ attachment: canvas.toBuffer(), name: `info-on-${args.address}.png` }] }).catch(e => { msg.reply('Unable to send message, I may not have permission to attach files.'); });
                } else {
                    msg.reply(`Couldn't connect to the server. Maybe it's offline.`);
                }
            }
            mcClient.end();
        });

        mcClient.on('timeout', () => {
            mcClient.end();
        });
        mcClient.on('error', (err) => {
            msg.reply(`Error: \`${err}\``);
        });
    }
};