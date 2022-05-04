const { Schema, model } = require('mongoose');

const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
    email: {
        type: String, validate: {
            validator(value) {
                return EMAIL_PATTERN.test(value)
            },
            message: 'Email must be a valid'
        }
    },
    hashedPassword: { type: String, required: true, minlength: [4, 'Password must be at least 4 characters'] },
    gender: { type: String, required: [true, 'Please sellect gender!'], enum: ['male', 'female'] },
    tripsHistory: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
});

const User = model('User', userSchema);

module.exports = User;
