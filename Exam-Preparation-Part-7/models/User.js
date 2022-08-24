const { Schema, model } = require('mongoose');

const NAME_PATTERN = /^[a-zA-Z0-9]+$/;

const userSchema = new Schema({
    username: {
        type: String,minlength: [5, 'Username must be at least 5 characters long!'], validate: {
            validator(value) {
                return NAME_PATTERN.test(value)
            },
            message: 'Name must be a valid'
        }
    },
    hashedPassword: { type: String, required: true},
    enrolled: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
});

const User = model('User', userSchema);

module.exports = User;


