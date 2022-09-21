const User = require('../models/User');
const { hash, compare } = require('bcrypt');

async function register(email, password, skills) {
    if (await User.findOne({email})) {
        throw new Error('Email exists!');
    }
    
    const hashedPassword = await hash(password, 10);
    const user = new User({ email, hashedPassword,skills });
    await user.save();
    return user;
};

async function login(email, password) {
    const user = await getUserByUserName(email)
    if (!user) {
        throw new Error('Incorect username or password')
    }
    
    const hasMatch = await compare(password, user.hashedPassword)
    if (!hasMatch) {
        throw new Error('Incorect username or password')
    }
    return user
};

async function getUserByUserName(email) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    
    return user
};

module.exports = {
    register,
    login,
}