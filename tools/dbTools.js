const Discord = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbUrl = "mongodb://localhost:27017/jim";

/**
 * Gets a user's db data
 * @param {msg} msg - uh 
 * @param {message} message - message to log
 */
module.exports.modLog = function(msg, message) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var query = { guildId: `${msg.guild.id}` };
        db.collection(`guilds`).findOne(query, function(err, results) {
            if (!results) {
                return;
            } else {
                try {
                    msg.guild.channels.find('name', results.modLogChannel).send(message);
                } catch (x) { console.log('Channel not found'); }
            }
        });
    });
};
/**
 * Gets a user's db data
 * @param {string} userId - user's id
 */
module.exports.getUserData = (userId) => {
    MongoClient.connect(dbUrl, function(err, db) {
        db.collection(`users`).findOne({ userId: `${userId}` }, function(err, results) {});
    });
};
/**
 * Sets a user's db data
 * @param {string} userId - user's unique id
 * @param {object} dataObj - the data being set 
 */
module.exports.setUserData = (userId, dataObj) => {
    var query = { 'userId': `${userId}` };
    var values = { $set: dataObj };
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        db.collection("users").updateOne(query, values, function(err, res) {
            if (err) throw err;

        });
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