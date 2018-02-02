var mongoose = require('mongoose');

var guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        unique: true,
        required: true
    },
    modLogChannel: {
        type: String,
        required: true
    },
    modRole: {
        type: String,
        required: true
    },
    welcomeChannel: {
        type: String,
        required: true
    },
    welcomeMessage: {
        type: String,
        required: true
    },
    leaveMessage: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },

    tags: [{ name: String, body: String }]
});
guildSchema.statics.findId = function(id) {
    return this.find({ guildId: new RegExp(id, 'i') });
};
guildSchema.statics.addTag = function(name, body) {
    let tags = this.tags.toJSON();
    tags.push({ name: name, body: body });
    return this.updateOne({ _id: this.id }, { $set: { tags: tags } });
};

var Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;