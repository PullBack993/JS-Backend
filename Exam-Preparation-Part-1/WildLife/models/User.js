const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const NAME_PATTERN = /^[A-Za-z]*$/;
const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
    firstName: {
        type: String, required: true, minlength: [3, 'First name must be at least 3 characters long'], validate: {
            validator(value) {
                return NAME_PATTERN.test(value)
            },
            message: 'First name may contain only english letters'
    }},
    lastName: {
        type: String, required: true, minlength: [5, 'Last name must be at least 5 characters long'], validate: {
            validator(value) {
                return NAME_PATTERN.test(value);
        }
    }},
    email: {
        type: String, required: true, validate: {
            validator(value) {
                return EMAIL_PATTERN.test(value);
        }
    } },
    hashedPassword: { type: String, required: true,minlength: [4, 'Password must be at least 4 characters long'] },
    myPosts: [{ type:  Schema.Types.ObjectId, ref: 'Post' }]
});

userSchema.methods.comparePassword = async function (password) {
    return await comparePassword(password, this.hashedPassword);
};

userSchema.pre('save', async function (next) {
    if (this.isModified('hashedPassword')) {
        this.hashedPassword = await hashPassword(this.hashedPassword)
    }
    next();
});

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
};

async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
};

const User = model('User', userSchema);

module.exports = User;