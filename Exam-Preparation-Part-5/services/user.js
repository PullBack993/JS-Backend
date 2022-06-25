const User = require('../models/User');
const { hash, compare } = require('bcrypt');

async function register(username, adress, password) {
    const hashedPassword = await hash(password, 10);
    const user = new User({ username,adress, hashedPassword });
    await user.save();
    return user;
};

async function login(username, password) {
    const user = await getUserByUserName(username)
    if (!user) {
        throw new error('Incorect username or password')
    }

    const hasMatch = await compare(password, user.hashedPassword)
    if (!hasMatch) {
        throw new error('Incorect username or password')
    }
    return user
};

async function getUserByUserName(username) {
    const user = await User.findOne({username: new RegExp(`^${username}$`, 'i')});
    return user
};

async function getUserById(id) {
    return await User.findById(id).populate('myPublications').lean();
};

module.exports = {
    register,
    login,
    getUserById,
};