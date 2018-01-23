const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
const dbUrl = "mongodb://localhost:27017/jim";
const MongoClient = require('mongodb').MongoClient;

module.exports = class CreateUserTag extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'createusertag',
            aliases: ['createut', 'addut', 'aut'],
            group: 'tags',
            memberName: 'createusertag',
            description: 'Create a custom command, aka a tag.',
            format: '<tagname>||<tag message>',
            guildOnly: true,
            details: oneLine `
                Create's a custom text based command.
            `,
            examples: ['aut cool||Jimbot is a cool bot.', 'createusertag jimmy||jimmy boi is a great bot'],

            args: [{
                key: 'tag',
                label: 'Tag info',
                prompt: 'What is your tag going to be?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        var query = { 'userId': `${msg.author.id}` };
        MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
            db.collection(`users`).findOne(query, function(err, results) {
                const [tagName, tagMessage] = args.tag.split('||');
                const tagMap = new Map();
                tagMap.set(tagName, tagMessage);
                results.tags[tagName] = tagMessage;
                var obj = results.tags;
                var values = { $set: { obj } };
                db.collection("users").insertOne(results.tags, values);
            });
        });
    }
};