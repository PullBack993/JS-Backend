const { Schema, model } = require('mongoose')

const URL_PATTERN = /^https?.\/\/(.+)/;

const hotelSchema = new Schema({
    name: { type: String, minlength: [4, 'Name muss be at least 4 characters long'] },
    city: { type: String, required: [true, 'City muss be at least 3 characters long'], minlength: 3 },
    image: {
        type: String, required: true, validate: {
            validator(value) {
                return URL_PATTERN.test(value)
            },
            message: 'Please enter a valid image url'
        }
    },
    freeRooms: { type: Number, min: [1, 'The Available Pieces should be positive number (from 1 to 100)'], max: [100, 'The Available Pieces should be positive number (from 1 to 100)'] },
    booked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

const Hotel = model('Hotel', hotelSchema);

module.exports = Hotel;