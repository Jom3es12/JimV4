var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    isOwner: {
        type: Boolean,
        required: true
    },
    warns: {
        type: Number,
        required: false
    },
    points: {
        type: Number,
        required: false
    },
    birthday: {
        type: String,
        required: false
    },
    tags: [{ name: String, body: String }]
});
userSchema.statics.findId = function(id) {
    return this.find({ userId: new RegExp(id, 'i') });
};
userSchema.statics.addTag = function(name, body) {
    let tags = this.tags.toJSON();
    tags.push({ name: name, body: body });
    return this.update({ _id: this.id }, { $set: { tags: tags } });
};

var User = mongoose.model('User', userSchema);
module.exports = User;