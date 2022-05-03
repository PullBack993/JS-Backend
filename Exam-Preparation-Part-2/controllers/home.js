const { isUser } = require('../middleware/guards');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home')
});

router.get('/profile', isUser(), (req, res) => {
    res.render('profile')
});

router.get('*', (req, res) => {
    res.render('404')
});

module.exports = router;