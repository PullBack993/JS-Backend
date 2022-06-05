const { Schema, model } = require('mongoose');

const EMAIL_PATTERN = /^([a-zA-Z0-9]+)@([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)$/;

const userSchema = new Schema({
    email: {
        type: String, required: true, validate: {
            validator(value) {
                return EMAIL_PATTERN.test(value);
        }
    } },
    username: {type: String, minlength: [, 'Username muss be at least 5 characters']},
    hashedPassword: { type: String, required: true, minlength: [4, 'Password must be at least 4 characters'] },
    bookedHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
    offeredHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
});

const User = model('User', userSchema);

module.exports = User;
