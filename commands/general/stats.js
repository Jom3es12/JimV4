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
            group: 'general',
            memberName: 'stats',
            description: 'gives stats about the bot',
            examples: ['stats'],
        });
    }

    async run(msg) {
        const processUptime = moment.duration(msg.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const serverUptime = moment.duration(getSysUptime()).format(" D [days], H [hrs], m [mins], s [secs]");
        const uptime = process.uptime();
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        // Canvas Setup
        const Image = Canvas.Image;
        const canvas = new Canvas(400, 115);
        const ctx = canvas.getContext('2d');
        // main bg
        ctx.fillStyle = `#1565c0`;
        ctx.fillRect(0, 0, 400, 115);
        // title bar
        ctx.fillStyle = '#003c8f';
        ctx.fillRect(0, 0, 400, 17);
        ctx.font = 'small-caps bold 12px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText("JIM'S STATS ", 5, 13);
        // body text
        ctx.font = '12px sans-serif';
        ctx.scale(1, 1);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Memory Usage: ${memoryUsage} MB`, 5, 32);
        ctx.fillText("• Client Uptime: " + processUptime, 5, 47);
        ctx.fillText("• Server Uptime: " + serverUptime, 5, 62);
        ctx.fillText(`• Users: ${msg.client.users.size}`, 5, 77);
        ctx.fillText(`• Servers: ${msg.client.guilds.size}`, 5, 92);
        ctx.fillText(`• Channels: ${msg.client.channels.size}`, 5, 107);
        // send image
        msg.channel.send('', { files: [{ attachment: canvas.toBuffer(), }] }).catch(e => { msg.reply('Unable to send message, check my permissions.'); });
    }
};