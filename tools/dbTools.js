const Discord = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbUrl = "mongodb://localhost:27017";

/**
 * Gets a user's db data
 * @param {msg} msg - pass that msg on through 
 * @param {message} message - message to log
 */
module.exports.modLog = function(msg, message) {
    const Guild = require('../models/guildModel');
    Guild.find({ guildId: msg.guild.id }, function(err, res) {
        const modLogChannel = res[0].modLogChannel;
        try {
            msg.guild.channels.find('name', res[0].modLogChannel).send(message);
        } catch (x) {
            console.log('Failed to log message.');
        }
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
        const collection = db.collection('users');
        collection.updateOne(query, values, function(err, res) {
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