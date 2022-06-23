const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, minlength: [4, 'Username muss be at least 4 characters!'] },
    adress: { type: String, required: [true, 'Adress muss be at least 1 character!'], maxlength: [20, 'Adress muss be at least 20 characters!'] },
    hashedPassword: { type: String, required: true, minlength: [3, 'Password must be at least 3 characters'] },
    myPublications: [{ type: Schema.Types.ObjectId, ref: 'Publication' }],
});

const User = model('User', userSchema);

module.exports = User;

