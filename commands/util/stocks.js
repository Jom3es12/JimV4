const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class stocks extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'stocks',
            aliases: ['stock'],
            group: 'util',
            memberName: 'stocks',
            description: 'Tells the stock price of the given stock.',
            examples: ['stock AMD'],

            args: [{
                key: 'stock',
                label: 'symbol',
                prompt: 'Which stock are you enquiring about?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        var yahooFinance = require('yahoo-finance')
        yahooFinance.snapshot({
            symbol: args.stock,
            fields: [
                's', // Symbol
                'n', // Name
                'a', // Ask
                'b', // Bid
                'p2', // Change in Percent
                'c1' // Change in Amount
            ]
        }, function(error, snapshot) {
            if (error) {
                msg.channel.send("couldn't get stock: " + error)
            } else {
                msg.channel.send(`
                ${snapshot.symbol} || ${snapshot.name}  
        Price: $${snapshot.ask}
        Change: $${snapshot.change.toFixed(2)}(${(snapshot.changeInPercent * 100).toFixed(2)}%)
                `);
            }
        });
    }
};