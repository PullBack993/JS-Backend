const { Schema, model } = require('mongoose');

const playSchema = new Schema({
    title: { type: String, required: [true, 'Title is required!'] },
    description: { type: String, maxlength: [50, 'Description muss be maximum 50 characters long!'] },
    image: { type: String, required: [true, 'Image is required!'] },
    isPublic: { type: Boolean, default: false },
    created: { type: String, required: true },
    liked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

playSchema.index({ title: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Play = model('Play', playSchema);

module.exports = Play;