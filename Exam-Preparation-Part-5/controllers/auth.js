const router = require('express').Router();
const { isUser, isGuest, mapErrors } = require('../middleware/guards');
const { register, login, getUserById } = require('../services/user');
const { getUserShared } = require('../services/galleryServices');


router.get('/register', isGuest(), (req, res) => {
    res.render('register')
});

router.post('/register', isGuest(), async (req, res) => {
    const { username, password, repass, adress } = req.body
    try {
        if (username == '' || adress == '') {
            throw new Error('Username or adress cannot be empty')
        }
        if (password.length < 3) {
            throw new Error('Password cannot be less then 3 characters')
        }
        if (password != repass) {
            throw new Error('Password don\'t match')
        }
        const user = await register(username, adress, password);
        req.session.user = user
        res.redirect('/')

    } catch (err) {
        console.log(err)
        const errors = mapErrors(err)
        res.render('register', { data: { username: username, adress: adress }, errors })
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
        };
        const user = await login(username, password);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        console.log(err);
        const errors = mapErrors(err);
        res.render('login', { data: { username: username }, errors });
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
        let data = await getUserShared(userId)

        user.title = data.map(p => p.title).join(', ')
        user.myPublications = user.myPublications.map(u => u.title).join(', ')

        res.render('profile', { user })
    } catch (err) {
        console.log(err)
        res.redirect('/404')
    }
});

module.exports = router;