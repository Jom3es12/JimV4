/* eslint-disable no-console */
const commando = require('discord.js-commando');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const config = require('./config.json');
var stathat = require('stathat');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbUrl = "mongodb://localhost:27017/jim";
var util = require('util');

const client = new commando.Client({
    owner: config.owners,
    commandPrefix: config.prefix,
    fetchAllMembers: true,
    unknownCommandResponse: false
});

process.on('unhandledRejection', err => console.error(`Uncaught Promise Error: \n${err.stack}`));

client.on("guildCreate", guild => {
    var defaultSettings = {
        guildId: `${guild.id}`,
        modLogChannel: "mod-log",
        welcomeChannel: "mod-log",
        modRole: "Moderator",
        favorite: false,
        tags: {
            foo: 'bar'
        },
        welcomeMessage: '<<member>> has joined our server.',
        leaveMessage: '<<member>> left the server.',
        'prefix': null,
        language: 'en'
    };

    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection('documents');
        collection.updateOne(defaultSettings, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            callback(result);
        });
    });
});

client.on("guildMemberAdd", member => {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var query = { guildId: `${member.guild.id}` };
        db.collection(`guilds`).findOne(query, function(err, results) {
            if (!results) {
                return console.log('couldn\'t find channel');
            } else {
                if (!member.guild.channels.find('name', results.welcomeChannel)) return;
                if (results.leaveMessage == 'disable') return;
                var welcomeMessage = results.welcomeMessage.replace('<<member>>', member.user.username);
                member.guild.channels.find('name', results.welcomeChannel).send(welcomeMessage);
            }
        });

        var defaultUserSettings = {
            userId: `${member.user.id}`,
            warns: 0,
            points: '10',
            tags: {
                foo: 'bar'
            },
            kogamaData: {
                brId: '',
                usId: '',
                wwwId: ''
            },
            robloxData: {
                id: '',
                joinDate: ''
            }
        };
        var insertUser = function() {
            db.collection('users', function(err, collection) {
                collection.insert(defaultSettings);
            });
        };
        var userQuery = { userId: `${member.user.id}` };
        db.collection(`users`).findOne(userQuery, function(err, results) {
            if (!results) {
                insertUser();
            } else {
                return;
            }
        });
        db.close();
    });
});

client.on('guildMemberRemove', (member) => {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var query = { guildId: `${member.guild.id}` };
        db.collection(`guilds`).findOne(query, function(err, results) {
            if (!results) {
                return;
            } else if (results.leaveMessage == 'disable') {
                return;
            } else {
                if (!member.guild.channels.find('name', results.welcomeChannel)) return;
                if (results.leaveMessage == 'disable') return;
                var welcomeMessage = results.leaveMessage.replace('<<member>>', member.user.username);
                member.guild.channels.find('name', results.welcomeChannel).send(welcomeMessage);
            }
        });
        db.close();
    });
});

setInterval(function() {
    stathat.trackEZValue("jtas1999@gmail.com", "users", client.users.size, function(status, json) {});
}, 10000);

client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('debug', console.log)
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
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token);