const { Schema, model } = require('mongoose');

const URL_PATTERN = /^https?.\/\/(.+)/;

const tripSchema = new Schema({
    startPoint: { type: String, required: true, minlength: [4, 'Starting Point muss be at least 4 characters long'] },
    endPoint: { type: String, required: true, minlength: [4, 'End Point muss be at least 4 characters long'] },
    date: { type: String, required: true },
    time: { type: String, required: true },
    carImage: {
        type: String, required: true, validate: {
            validator(value) {
                return URL_PATTERN.test(value)
            },
            message: 'Please enter a valid image url'
        }
    },
    carBrand: { type: String, required: true, minlength: [4, 'Starting Point muss be at least 4 characters long'] },
    seats: { type: Number, required: true, min: 0, max: 4, message: 'Seats can be from 0 to 4 inclusive' },
    price: { type: Number, required: true, min: 1, max: 50, message: 'Price can be from 1 to 50 inclusive' },
    description: { type: String, required: true, minlength: [10, 'Description muss be at least 10 characters long'] },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    buddie: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Trip = model('Trip', tripSchema);

module.exports = Trip;