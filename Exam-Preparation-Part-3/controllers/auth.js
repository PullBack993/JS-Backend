const { isUser, isGuest,mapErrors } = require('../middleware/guards');
const { register, login, getUserById } = require('../services/user');

const router = require('express').Router();

router.get('/register', isGuest(), (req, res) => {
    res.render('register')
});

router.post('/register', isGuest(), async (req, res) => {
    const { name, username, password, repass } = req.body
    try {
        if (name == '') {
            throw new Error('Full name cannot be empty')
        }
        if (password.length < 4) {
            throw new Error('Password cannot be less then 4 characters')
        }
        if (password != repass) {
            throw new Error('Password don\'t match')
        }
        const user = await register(name, username, password);
        req.session.user = user
        res.redirect('/')

    } catch (err) {
        console.log(err)
        const errors = mapErrors(err)
        res.render('register', { data: { name: name, username: username }, errors })
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login')
});

router.post('/login', isGuest(), async (req, res) => {
    const { username, password } = req.body
    try {
        if (username == '' || password == '') {
            throw new Error('You must provide a  and password')
        }
        const user = await login(username, password)
        req.session.user = user
        res.redirect('/')
    } catch (err) {
        console.log(err)
        const errors = mapErrors(err)
        res.render('login', { data: { username: username }, errors })
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