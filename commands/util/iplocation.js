const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
const stripIndents = require('common-tags').stripIndents;

module.exports = class iplocation extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'iplocation',
            aliases: ['ipl'],
            group: 'util',
            memberName: 'iplocation',
            description: 'A handy command to get the location of an ip',
            guildOnly: false,
            details: oneLine `
                
            `,
            examples: [''],

            args: [{
                key: 'ip',
                label: 'ip',
                prompt: 'What is the ip?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const iplocation = require('ip-location');
        const reg = /\b( ? : ( ? : 2( ? : [0 - 4][0 - 9] | 5[0 - 5]) | [0 - 1] ? [0 - 9] ? [0 - 9])\.) { 3 }( ? : ( ? : 2([0 - 4][0 - 9] | 5[0 - 5]) | [0 - 1] ? [0 - 9] ? [0 - 9]))\ b/ig
        const ip = args.ip;
        if (ip.match(reg) == false) {
            msg.channel.send('Sorry this is not a valid IPV4 Address.');
        } else {
            iplocation(ip).then(function(res) {
                let m = stripIndents `
                \`\`\`asciidoc
                • Country :: ${res.country_name}
                • Region :: ${res.region_name}
                • City :: ${res.city}
                \`\`\`
                === Results For ${ip} ===
                `;
                msg.channel.send(m);
            }).catch(err => {
                console.error(err);
            });
        }
    }
};