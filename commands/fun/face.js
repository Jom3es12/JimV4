const commando = require('discord.js-commando');
const apiai = require('apiai');
const app = apiai('027ac54aa26a497e948f334885fc3049');
module.exports = class face extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'face',
            group: 'fun',
            memberName: 'face',
            description: 'Sends a cute face based on the emotion you give it.',
            examples: ['jim face'],
            args: [{
                key: 'text',
                label: 'emotion',
                prompt: 'What emotion am I trying to display?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        var apiOptions = {
            sessionId: msg.author.id
        };
        var request = app.textRequest(args.text, apiOptions);
        request.on('response', function(response) {
            var responseText = response.result.fulfillment.speech;
            msg.channel.send(responseText);
        });

        request.on('error', function(error) {
            return; // oh well I guess
        });
        request.end();
    }
};