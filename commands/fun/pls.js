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
            aliases: [],
            group: 'fun',
            memberName: 'pls',
            description: 'Jat pls',
            details: oneLine `
                  Takes given username and makes an image that says "pls (user)
            `,
            examples: ['pls jat '],
            args: [{
                key: 'user',
                label: 'user',
                prompt: 'pls who?',
                type: 'user'
            }]

        });
    }

    async run(msg, args) {
        const canvas = new Canvas(300, 75);
        const ctx = canvas.getContext('2d');
        const Image = Canvas.Image;
        const base = new Image();
        ctx.scale(1, 1);
        ctx.font = '20px Roboto';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('pls', 12, 30);
        ctx.fillText(args.user.username, 12, 55);
        msg.channel.send('', canvas.toBuffer(), `pls ${args.user}.png`);
        msg.channel.send("", { files: [{ attachment: canvas.toBuffer() }] });
    }
};