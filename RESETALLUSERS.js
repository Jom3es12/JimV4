const Discord = require('discord.js');
const client = new Discord.Client();
const ws = require('wait-sync');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jim');
var db = mongoose.connection;
db.once('open', function() {});

client.on('message', msg => {
    const Guild = require('./models/guildModel');
    if (msg.content == 'JAMISRESETTINGSTUFF') {
        console.log('Ye.');
        ws(0.01);
        let t = 0;
        msg.client.guilds.forEach(guild => {
            t = t + 1;
            console.log(guild.id);
            var guildData = {
                guildId: `${guild.id}`,
                modLogChannel: "mod-log",
                welcomeChannel: "mod-log",
                modRole: "mod",
                tags: [{ name: 'foo', body: 'bar' }],
                welcomeMessage: '<<member>> has joined our server.',
                leaveMessage: '<<member>> left the server.',
                language: 'en'
            };
            Guild.create(guildData, function(error, user) {
                if (error) return next(error);
            });
        });
    }
});
client.login('MjIxMzc4NzYyNDUxODQ1MTIx.DGobAw.6lGu3o-sO_LEiZUSbINbXRW5e_g')