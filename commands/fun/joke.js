const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class joke extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'joke',
            aliases: [],
            group: 'fun',
            memberName: 'joke',
            description: 'Tells a \'funny\' joke',
            details: oneLine `
                 Haha so funny(like gingyr)
            `,
            examples: ['jim joke'],


        });
    }

    async run(msg, args) {
        var joke = require('jokesearch');
        joke.getJoke(function(joke) {
            msg.channel.send(joke);
        });
    }
};