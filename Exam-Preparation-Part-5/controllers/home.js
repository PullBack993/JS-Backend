const { getAll, } = require('../services/galleryServices');

const router = require('express').Router();

router.get('/', async(req, res) => {
    const data = await getAll()
    data.map(user => user.usersShared = user.usersShared.length)
    res.render('home', {data})
    
});

router.get('*', (req, res) => {
    res.render('404')
});

module.exports = router;