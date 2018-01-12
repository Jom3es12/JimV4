const Discord = require('discord.js');
const client = new Discord.Client();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbUrl = "mongodb://localhost:27017/jim";

module.exports.modLog = function(msg, message) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var query = { guildId: `${msg.guild.id}` };
        db.collection(`guilds`).findOne(query, function(err, results) {
            if (!results) {
                return msg.channel.send('Log channel not found');
            } else {
                msg.guild.channels.find('name', results.modLogChannel).send(message);
            }
        });
        db.close();
    });
};

module.exports.checkMod = function(msg, user) {
    let aZCheck;
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var query = { guildId: `${msg.guild.id}` };
        db.collection(`guilds`).findOne(query, function(err, results) {
            var bean = msg.guild.members.get(msg.author.id).roles.some(role => [results.modRole].includes(role.name));
            if (bean == true) {
                aZCheck = 'true';
            } else {
                aZCheck = 'false';
            }
        });
        db.close();
    });
    if (aZCheck == 'true') return true;
    else return false;
};