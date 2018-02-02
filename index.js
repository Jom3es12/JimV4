/* eslint-disable no-console */
const commando = require('discord.js-commando');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const config = require('./config.json');
var stathat = require('stathat');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jim');
var db = mongoose.connection;
db.once('open', function() {});
var util = require('util');

const client = new commando.Client({
    owner: config.owners,
    commandPrefix: config.prefix,
    fetchAllMembers: true,
    unknownCommandResponse: false
});

process.on('unhandledRejection', err => console.error(`Uncaught Promise Error: \n${err.stack}`));

client.on("guildCreate", guild => {
    const Guild = require('./models/guildModel');
    var guildData = {
        guildId: `${guild.id}`,
        modLogChannel: "mod-log",
        welcomeChannel: "mod-log",
        modRole: "mod",
        tags: {
            foo: 'bar'
        },
        welcomeMessage: '<<member>> has joined our server.',
        leaveMessage: '<<member>> left the server.',
        language: 'en'
    };

    if (err) throw err;
    Guild.create(guildData, function(error, user) {
        if (error) return next(error);
    });
});

client.on("guildMemberAdd", member => {
    const User = require('./models/userModel');
    const Guild = require('./models/guildModel');
    var userData = {
        userId: `${member.user.id}`,
        warns: 0,
        points: 10,
        isOwner: false,
        tags: [{ name: 'foo', body: 'bar' }]
    };

    User.create(userData, function(error, user) {
        if (error) return console.log(error);
    });
    Guild.findOne({ guildId: member.guild.id }, function(err, res) {
        console.log(res);
        const welcomeChannel = res[0].welcomeChannel;
        const welcomeMessage = res[0].welcomeMessage.replace('<<member>>', member.user.username);
        member.guild.channels.find('name', welcomeChannel).send(welcomeMessage);
    });

});

client.on('guildMemberRemove', (member) => {
    const Guild = require('./models/guildModel');
    Guild.find({ guildId: member.guild.id }, function(err, res) {
        const welcomeChannel = res[0].welcomeChannel;
        const leaveMessage = res[0].leaveMessage.replace('<<member>>', member.user.username);
        member.guild.channels.find('name', welcomeChannel).send(leaveMessage).catch(x => console.log(x));
    });
});



// Track users every 300000ms (5 minutes lol)
setInterval(function() {
    stathat.trackEZValue("jtas1999@gmail.com", "users", client.users.size, function(status, json) {});
}, 300000);

client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('debug', console.debug)
    .on('ready', () => {
        console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        client.user.setGame('Jim help');
    })
    .on('disconnect', () => {
        console.warn('Disconnected!');
    })
    .on('reconnect', () => {
        console.warn('Reconnecting...');
    })
    .on('commandError', (cmd, err) => {
        if (err instanceof commando.FriendlyError) return;
        console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
    .on('commandBlocked', (msg, reason) => {
            console.log(oneLine `
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
    })
    .on('commandPrefixChange', (guild, prefix) => {
        console.log(oneLine `
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('commandStatusChange', (guild, command, enabled) => {
        console.log(oneLine `
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('groupStatusChange', (guild, group, enabled) => {
        console.log(oneLine `
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    });

client.registry
    .registerDefaults()
    .registerGroup('general', 'General')
    .registerGroup('fun', 'Fun')
    .registerGroup('math', 'Math')
    .registerGroup('moderation', 'Moderation')
    .registerGroup('tags', 'Tag Systen')
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token);