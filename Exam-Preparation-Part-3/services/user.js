const User = require('../models/User');

const { hash, compare } = require('bcrypt');

async function register(name,username, password) {
    const hashedPassword = await hash(password, 10);
    const user = new User({ name,username, hashedPassword });
    await user.save();
    return user;
};

async function login(username, password) {
    const user = await getByUsername(username)
    if (!user) {
        throw new Error('Incorect username or password')
    }
    const hasMatch = await compare(password, user.hashedPassword)
    if (!hasMatch) {
        throw new Error('Incorect username or password')
    }
    return user
};

async function getByUsername(username) {
    const user = await User.findOne({username});
    return user
};

async function getUserById(id) {
    const user = await User.findById(id)?.populate('tripsHistory').lean();
    return user;
};

module.exports = {
    register,
    login,
    getUserById
};

