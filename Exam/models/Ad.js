const { Schema, model } = require('mongoose')

const adSchema = new Schema({
    headline: { type: String, minlength: [4, 'Headline muss be at least 4 characters long'] },
    location: { type: String, minlength: [8, 'Location muss be at least 8 characters long'] },
    name: { type: String, minlength: [3, 'Company name muss be at least 3 characters long'] },
    description: { type: String, maxlength: [40, 'Company description muss be at least 40 characters long'] },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    userApplied: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Ad = model('Ad', adSchema)

module.exports = Ad;
