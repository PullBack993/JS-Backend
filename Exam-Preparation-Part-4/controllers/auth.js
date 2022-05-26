const { isUser, isGuest,mapErrors } = require('../middleware/guards');
const { register, login,getUserById } = require('../services/user');

const router = require('express').Router();

router.get('/register', isGuest(), (req, res) => {
    res.render('register')
});

router.post('/register', isGuest(), async (req, res) => {
    const { email, username, password, repass } = req.body
    try {
        if (email == '') {
            throw new Error('Email cannot be empty')
        }
        if (password.length < 4) {
            throw new Error('Password cannot be less then 4 characters')
        }
        if (password != repass) {
            throw new Error('Password don\'t match')
        }
        const user = await register(email, username, password);
        req.session.user = user
        res.redirect('/')
    } catch (err) {
        console.log(err)
        const errors = mapErrors(err)
        res.render('register', { errors })
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login')
});

router.post('/login', isGuest(), async (req, res) => {
    const { username, password } = req.body
    try {
        if (username == '' || password == '') {
            throw new Error('All fields are required!')
        }
        const user = await login(username, password)
        req.session.user = user
        res.redirect('/')
    } catch (err) {
        console.log(err)
        const errors = mapErrors(err)
        res.render('login', { errors })
    };
});

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user
    res.redirect('/')
});

router.get('/profile', isUser(), async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await getUserById(userId);
        user.bookedHotels = user.bookedHotels.map(b => b.name).join(', ')
        res.render('profile', { user })
    } catch (err) {
        console.log(err)
        res.redirect('/404')
    }
});

module.exports = router;