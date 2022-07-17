const { isUser, isGuest,mapErrors } = require('../middleware/guards');
const { register, login } = require('../services/user');

const router = require('express').Router();

router.get('/register', isGuest(), (req, res) => {
    res.render('register')
});

router.post('/register', isGuest(), async (req, res) => {
    const { username, password, repass } = req.body
    try {
        if (username == '') {
            throw new Error('Username cannot be empty')
        }
        if (password.length < 3) {
            throw new Error('Password cannot be less then 3 characters')
        }
        if (password != repass) {
            throw new Error('Password don\'t match')
        }

        const PASSWORD_PATTERN = /^[a-zA-Z0-9]+$/;

        const testPassword = PASSWORD_PATTERN.test(password)
        if (testPassword) {
            const user = await register(username, password);
            req.session.user = user
            res.redirect('/')
        } else {
            throw new Error('The password should be at least 5 characters long and should consist only english letters and digits')
        }
    } catch (err) {
        console.log(err)
        const errors = mapErrors(err)
        res.render('register', { username, errors })
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login')
});

router.post('/login', isGuest(), async (req, res) => {
    const { username, password } = req.body
    try {
        if (username == '' || password == '') {
            throw new Error('You must provide username and password')
        }
        const user = await login(username, password)
        req.session.user = user
        res.redirect('/')
    } catch (err) {
        console.log(err)
        const errors = mapErrors(err)
        res.render('login', { username, errors })
    };
});

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user
    res.redirect('/')
});

module.exports = router;