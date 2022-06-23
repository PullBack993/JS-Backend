const { Schema, model } = require('mongoose');

const URL_PATTERN = /^https?.\/\/(.+)/;

const publicationSchema = new Schema({
    title: { type: String, minlength: [6, 'Name muss be at least 6 characters long'] },
    paintingTech: { type: String, maxlength: [15, 'Painting technique muss be maxiumum 15 characters long'] },
    image: {
        type: String, required: true, validate: {
            validator(value) {
                return URL_PATTERN.test(value)
            },
            message: 'Please enter a valid image url'
        }
    },
    certificate: { type: String, enum: { values: ['yes', 'no'], message: 'Valid type are "yes" or "no"' } },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    usersShared: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Publication = model('Publication', publicationSchema);

module.exports = Publication;