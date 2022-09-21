const { Schema, model } = require('mongoose')

const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
    email: {
        type: String,require:true, validate: {
            validator(value) {
                return EMAIL_PATTERN.test(value)
            },
            message: 'email must be a valid'
        }
    },
    hashedPassword: { type: String, required: true, minlength: [5, 'Password must be at least 5 characters'] },
    skills: { type: String, maxlength: [40, 'Skills muss be maximum 40 characters'] },
    ads: [{ type: Schema.Types.ObjectId, ref: 'Ad'}],
});

userSchema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});



const User = model('User', userSchema);

module.exports = User;

