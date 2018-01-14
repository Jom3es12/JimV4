const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require("discord.js");
const path = require('path');
const request = require('request-promise');
const Canvas = require('canvas');
const config = require('../../config.json');

module.exports = class Profile extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'pls',
            group: 'fun',
            memberName: 'pls',
            description: 'Put the words pls before someone\'s username.',
            guildOnly: true,
            examples: ['pls jat '],
            args: [{
                key: 'member',
                label: 'member',
                prompt: 'pls who?',
                type: 'member'
            }]
        });
    }

    async run(msg, args) {
        // Canvas Setup
        const canvas = new Canvas(250, 75);
        const ctx = canvas.getContext('2d');
        // main bg
        ctx.fillStyle = `#1565c0`;
        ctx.fillRect(0, 0, 400, 100);
        ctx.scale(1, 1);
        // main text
        ctx.font = 'small-caps bold 20px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Pls', 12, 30);
        ctx.fillText(args.member.user.username, 12, 55);
        // send image
        msg.channel.send("", { files: [{ attachment: canvas.toBuffer() }] }).catch(e => { msg.reply('Unable to send message, check my permissions.'); });
    }
};