const { getAll } = require('../services/hotelSer');

const router = require('express').Router();

router.get('/', async(req, res) => {
    const hotels = await getAll()
    res.render('home', {hotels})
});

module.exports = router;