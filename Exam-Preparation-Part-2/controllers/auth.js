const { isUser, isGuest,mapErrors } = require('../middleware/guards');
const { register, login, getUserById } = require('../services/user');

const router = require('express').Router();

router.get('/register', isGuest(), (req, res) => {
    res.render('register')
});

router.post('/register', isGuest(), async (req, res) => {
    const { email, password, repass, gender } = req.body
    try {
        if (password == '' || repass == '') {
            throw new Error('Passwords cannot be empty')
        }
        if (password.length < 4) {
            throw new Error('Password cannot be less then 4 characters')
        }
        if (password != repass) {
            throw new Error('Password don\'t match')
        }
        const user = await register(email, password, gender);
        req.session.user = user
        res.redirect('/')

    } catch (err) {
        const errors = mapErrors(err)
        res.render('register', { data: { email: email }, errors })
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login')
});

router.post('/login', isGuest(), async (req, res) => {
    const { email, password } = req.body
    try {
        if (email == '' || password == '') {
            throw new Error('You must provide a  and password')
        }
        const user = await login(email, password)
        req.session.user = user
        res.redirect('/')
    } catch (err) {
        console.log(err)
        const errors = mapErrors(err)
        res.render('login', { data: { email: email }, errors })
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
        user.count = user.tripsHistory.length
        res.render('profile', { user })
    } catch (err) {
        console.log(err)
        res.redirect('/404')
    }
});

module.exports = router;