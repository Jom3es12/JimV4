const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');

module.exports = class CreateGuildTag extends commando.Command {
    constructor(client) {
        super(client, {
            name: '',
            aliases: [],
            group: '',
            memberName: '',
            description: '',
            guildOnly: true,
            details: oneLine `
                
            `,
            examples: [''],

            args: [{
                key: '',
                label: '',
                prompt: '',
                type: ''
            }]
        });
    }

    async run(msg, args) {
        // code  
    }
};