const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const btcstats = require('btc-stats');

module.exports = class Btc extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'bitcoin',
            aliases: ['btc'],
            group: 'general',
            memberName: 'btc',
            description: 'Quick show of the btc price',
            details: oneLine `
                Shows the sell average between the bitfinex, bitstamp and okcoin exchanges.
            `,
            examples: ['btc'],
        });
    }

    async run(msg, args) {
        btcstats.exchanges(['bitfinex', 'bitstamp', 'okcoin']);
        btcstats.avg(function(error, resp) {
            if (!error) {
                msg.channel.send('The current Bitcoin price is: ' + JSON.stringify(resp.price) + 'USD');
            }
        });
    }
};