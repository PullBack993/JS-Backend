const User = require('../models/User');
const { hash, compare } = require('bcrypt');

async function register(username, password) {
    const hashedPassword = await hash(password, 10);
    const user = new User({ username, hashedPassword });
    await user.save();
    return user;
};

async function login(username, password) {
    const user = await getUserByUserName(username)
    console.log(user)
    if (!user) {
        throw new Error('Incorect username or password')
    }

    const hasMatch = await compare(password, user.hashedPassword)
    if (!hasMatch) {
        throw new Error('Incorect username or password')
    }
    
    return user
};

//TODO username ? email
async function getUserByUserName(username) {
    const user = await User.findOne({username: new RegExp(`^${username}$`, 'i')});
    return user
};


module.exports = {
    register,
    login,
}