const User = require('../models/User');
module.exports = () => (req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
        res.locals.hasUser = true;
        res.locals.email = req.session.user.email
    }
    req.auth = {
        register,
        login,
        getUserByEmail,
        getUserById,
    }
    next();
    
    async function register(firstName, lastName, email, password) {
        const existing = await getUserByEmail(email)

        if (existing) {
            throw new Error('Email is taken')
        }
        const user = new User({
            firstName,
            lastName,
            email,
            hashedPassword: password,
        });
        await user.save()

        req.session.user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.hashedPassword
        }
    }

    async function login(email, password) {
        const user = await getUserByEmail(email)
        
        if (user && await user.comparePassword(password)) {
            req.session.user = {
                id: user._id,
                email: user.email,
            }
            return true
        } else {
            throw new Error('Incorrect username or password');
        }
    }

    async function getUserByEmail(email) {
        const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') })
        return user
    }

    async function getUserById(id) {
        const user = await User.findById(id)
        return user
    }
};