const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require("discord.js");
const path = require('path');
const request = require('request-promise');
const Canvas = require('canvas');
const config = require('../../config.json');
const {
    version
} = require('../../package');
const fs = require("fs");
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

function getSysUptime() {
    return parseFloat(fs.readFileSync("/proc/uptime", {
        "encoding": "utf8"
    }).split(" ")[0]) * 1000;
}

module.exports = class stats extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            aliases: [],
            group: 'general',
            memberName: 'stats',
            description: 'gives stats about the bot',
            examples: ['stats'],
        });
    }

    async run(msg) {
        const processUptime = moment.duration(msg.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const serverUptime = moment.duration(getSysUptime()).format(" D [days], H [hrs], m [mins], s [secs]");
        const Image = Canvas.Image;
        const canvas = new Canvas(400, 100);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = `#002B36`;
        ctx.strokeStyle = `#000`;
        const uptime = process.uptime();
        ctx.fillRect(0, 0, 400, 100);
        ctx.strokeRect(0, 0, 400, 100);
        const theme = 'dark';
        const fontColor = '#93A1A1';
        ctx.font = '12px Consolas';
        ctx.scale(1, 1);
        ctx.fillStyle = fontColor;
        ctx.fillText(`• Meme Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, 5, 17);
        ctx.fillText("• Client Uptime: " + processUptime, 5, 32);
        ctx.fillText("• Server Uptime: " + serverUptime, 5, 47);
        ctx.fillText(`• Users: ${msg.client.users.size}`, 5, 62);
        ctx.fillText(`• Servers: ${msg.client.guilds.size}`, 5, 77);
        ctx.fillText(`• Channels: ${msg.client.channels.size}`, 5, 92);

        // send attachment
        msg.channel.send('', { files: [{ attachment: canvas.toBuffer(), }] });
    }
};