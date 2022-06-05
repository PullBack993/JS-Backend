const User = require('../models/User');
const { hash, compare } = require('bcrypt');

async function register(email,username, password) {
    const hashedPassword = await hash(password, 10);
    const user = new User({email, username, hashedPassword });
    await user.save();
    return user;
};

async function login(username, password) {
    const user = await getUserByUserName(username)

    if (!user) {
        throw new Error('Incorect username or password')
    }
    
    const hasMatch = await compare(password, user.hashedPassword)
    if (!hasMatch) {
        throw new Error('Incorect username or password')
    }
    if(!hasMatch)
    return user
};

async function getUserByUserName(username) {
    const user = await User.findOne({username: new RegExp(`^${username}$`, 'i')});
    return user
};

async function getUserById(id) {
    return await User.findById(id).populate('bookedHotels').lean()
};

module.exports = {
    register,
    login,
    getUserById,
};