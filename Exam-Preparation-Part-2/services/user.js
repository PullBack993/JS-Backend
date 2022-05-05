const User = require('../models/User');

const { hash, compare } = require('bcrypt');

async function register(email, password,gender) {
    const existing = await getUserByEmail(email);

    if (existing) {
        throw new error('Email is taken')
    };

    const hashedPassword = await hash(password, 10);
    const user = new User({ email, hashedPassword,gender });
    await user.save();
    return user;
};


async function login(email, password) {
    const user = await getUserByEmail(email)

    if (!user) {
        throw new Error('Incorect email or password')
    }
    const hasMatch = await compare(password, user.hashedPassword)

    if (!hasMatch) {
        throw new Error('Incorect email or password')
    }
    return user
};

async function getUserByEmail(email) {
    const user = await User.findOne({email});
    return user
};

async function getUserById(id) {
    const user = await User.findById(id)?.populate('tripsHistory').lean();
    return user;
};

module.exports = {
    register,
    login,
    getUserById,
};
