const { Schema, model } = require('mongoose');

const URL_PATTERN = /^https?.\/\/(.+)/;

const homeSchema = new Schema({
    name: { type: String, minlength: [6, 'Name muss be at least 6 characters long'] },
    type: { type: String, enum: ['apartment', 'villa', 'house'] },
    year: { type: Number, min: [1850, 'Year muss be between 1850-2021'], max: [2021, 'Year muss be between 1850-2021'], },
    city: { type: String, required: [true, 'City muss be at least 4 characters long'], minlength: 4 },
    homeImage: {
        type: String, required: true, validate: {
            validator(value) {
                return URL_PATTERN.test(value)
            },
            message: 'Please enter a valid image url'
        }
    },
    description: { type: String, required: [true, 'Description muss be maximum 60 characters long'], maxlength: [60, 'Description muss be maximum 60 characters long'] },
    available: { type: Number, min: [0, 'The Available Pieces should be positive number (from 0 to 10)'], max: [10, 'The Available Pieces should be positive number (from 0 to 10)'] },
    rentedHome: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Home = model('Home', homeSchema);

module.exports = Home;