const { Schema, model } = require('mongoose');

const NAME_PATTERN = /^[a-zA-Z]+\s[a-zA-Z]+$/;

const userSchema = new Schema({
    name: {
        type: String, validate: {
            validator(value) {
                return NAME_PATTERN.test(value)
            },
            message: 'Name must be a valid'
        }
    },
    username: {type: String, minlength: [5, 'Username muss be at least 5 characters']},
    hashedPassword: { type: String, required: true, minlength: [4, 'Password must be at least 4 characters'] },
});

const User = model('User', userSchema);

module.exports = User;
