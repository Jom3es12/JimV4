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


client.login(config.token);

module.exports = {
    muteEmitter: muteEmitter
};