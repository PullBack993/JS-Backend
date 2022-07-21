const { Schema, model } = require('mongoose');

const USERNAME_PATTERN = /^[a-zA-Z0-9]+$/;

const userSchema = new Schema({
    username: {
        type: String, minlength: [3, 'Username muss be at least 5 characters'], validate: {
            validator(value) {
                return USERNAME_PATTERN.test(value);
        }
    }},
    hashedPassword: { type: String, required: true, minlength: [3, 'Password must be at least 4 characters'] },
    likedPlays: [{ type: Schema.Types.ObjectId, ref: 'Play'}]
});

const User = model('User', userSchema);

module.exports = User;

