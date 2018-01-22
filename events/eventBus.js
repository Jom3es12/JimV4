const EventEmitter = require('events');
class MuteEmitter extends EventEmitter {}
const muteEmitter = new MuteEmitter();
const config = require("../config.json");
const Discord = require('discord.js');
const client = new Discord.Client();
var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://127.0.0.1:27017/jim";

muteEmitter.addListener('newMute', () => {});
muteEmitter.addListener('muteEnd', () => {});

muteEmitter.on('newMute', muteData => {
    console.log('newMute!');
    var { userId, endTime, guildId } = muteData;
    const guild = client.guilds.get(guildId);
    const member = guild.members.get(userId);
    member.addRole(guild.roles.find('name', 'jimmute'));
    // check every 5s if mute has ended
    const yuh = setInterval(checkMute, 2500);

    function stop() {
        clearInterval(yuh);
    }

    function checkMute() {
        if (Date.now() >= endTime) {
            stop()
            muteEmitter.emit('muteEnd', muteData);
        }
        if (!member.roles.find('name', 'jimmute')) {
            stop();
            return console.log('Member doesn\'t have role.');
        } else return;
    }
});
// I'm just glad it works.
muteEmitter.on('muteEnd', muteData => {
    const guild = client.guilds.get(muteData.guildId);
    const member = guild.members.get(muteData.userId);
    const muteRole = guild.roles.find('name', 'jimmute');
    if (!member.roles.find('name', 'jimmute')) return console.log('Member doesn\'t have role.');
    return member.removeRole(muteRole, `Unmuted ${member.user.username}.`);
});
client.login(config.token);

module.exports = {
    muteEmitter: muteEmitter
};