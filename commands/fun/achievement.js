const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const config = require('../../config.json');
const snekfetch = require('snekfetch');

module.exports = class achievement extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'achievement',
            group: 'fun',
            memberName: 'achievement',
            description: 'Generate a minecraft achievement.',
            guildOnly: false,
            format: '[Title Text]|<Achievement Text>',
            examples: ['Oh wow you|Used a Command!', 'Baked a cake!'],
            args: [{
                key: 'string',
                label: 'string',
                prompt: "Please provide a title and achievement text. (e.x `achievement Title|Text`)",
                type: 'string',
                infinite: false
            }]
        });
    }

    async run(msg, args) {
        let [title, contents] = args.string.split("|");
        if (!contents) {
            [title, contents] = ["Achievement Get!", title];
        }
        let rnd = Math.floor((Math.random() * 39) + 1);
        if (args.string.toLowerCase().includes("burn")) rnd = 38;
        if (args.string.toLowerCase().includes("cookie")) rnd = 21;
        if (args.string.toLowerCase().includes("cake")) rnd = 10;
        if (title.length > 22 || contents.length > 22) return msg.edit("Max Length: 22 Characters.").then(msg.delete.bind(msg), 2000);
        const url = `https://www.minecraftskinstealer.com/achievement/a.php?i=${rnd}&h=${encodeURIComponent(title)}&t=${encodeURIComponent(contents)}`;
        snekfetch.get(url)
            .then(r => msg.channel.send("", { files: [{ attachment: r.body }] }));
        msg.delete();
    }
};