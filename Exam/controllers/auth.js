const router = require('express').Router();
const { isUser, isGuest,mapErrors } = require('../middleware/guards');
const { register, login, } = require('../services/user');

router.get('/register', isGuest(), (req, res) => {
    res.render('register')
})

router.post('/register', isGuest(), async (req, res) => {
    const { email, password,repass,skills } = req.body
    try {
         if (Object.values(req.body).some(field => field == undefined || field == '') == true) {
            throw new Error( 'All fields required')
        }

        if (password.length < 5) {
            throw new Error('Password cannot be less then 5 characters')
        }
        if (password != repass) {
            throw new Error('Password don\'t match')
        }
        const user = await register(email, password,skills);
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
})

router.post('/login', isGuest(), async (req, res) => {
    const { email, password } = req.body
    
    try {
        if (email == '' || password == '') {
            throw new Error('You must provide a password')
        }
        const user = await login(email, password)
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
})


module.exports = router;