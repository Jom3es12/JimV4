process.title = 'Mute Process';
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("../config.json");
var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://127.0.0.1:27017/jim";
var muteEmitter = require('./eventBus.js').muteEmitter;
console.log(muteEmitter);

muteEmitter.on('newMute', muteData => {
    console.log('newMute!');
    var { userId, endTime, guildId } = muteData;
    const guild = client.guilds.get(guildId);
    const member = guild.members.get(userId);
    member.addRole(guild.roles.find('name', 'jimmute'));
    // check every 5s if mute has ended
    const checkMute = function() {
        if (Date.now() >= endTime) {
            muteEmitter.emit('muteEnd', muteData);
        } else return;
    };
    setInterval(checkMute, 2500);
});

muteEmitter.on('muteEnd', muteData => {
    const guild = client.guilds.get(muteData.guildId);
    const member = guild.members.get(muteData.userId);
    const muteRole = guild.roles.find('name', 'jimmute');
    if (!member.roles.find('name', 'jimmute')) return console.log('Member doesn\'t have role.');
    member.removeRole(muteRole, `Unmuted ${member.user.username}.`);
});

client.login(config.token);