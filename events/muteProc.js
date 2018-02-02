process.title = 'Mute Process';
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("../config.json");
var muteEmitter = require('./muteEmitter.js').muteEmitter;


muteEmitter.on('newMute', muteData => {
    setInterval(function(muteData) {
        if (Date.now() >= muteData.endTime) {
            clearInterval();
            return muteEmitter.emit('muteEnd', muteData);
        }
        if (!member.roles.find('name', 'jimmute')) {
            clearInterval();
            return console.log('Member doesn\'t have role.');
        } else return;
    }, 2500);
    console.log(muteData);
    console.log('newMute!');
    const guild = client.guilds.get(muteData.guildId);
    const member = guild.members.get(muteData.userId);
    member.addRole(guild.roles.find('name', 'jimmute')).catch(x => console.log(x));

});

muteEmitter.on('muteEnd', muteData => {
    console.log('Mute End');
    const guild = client.guilds.get(muteData.guildId);
    const member = guild.members.get(muteData.userId);
    const muteRole = guild.roles.find('name', 'jimmute');
    if (!member.roles.find('name', 'jimmute')) return;
    return member.removeRole(muteRole, `Unmuted ${member.user.username}.`);
});

client.login(config.token);