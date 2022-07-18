const { getLastTree, getAll } = require('../services/play');

const router = require('express').Router();

router.get('/', async (req, res) => {
    if (req.session.user == undefined) {
        const plays = await getLastTree()
        res.render('guestHome', {plays})
    } else {
        const plays = await getAll()
        plays.map(p => p.liked = p.liked.length)
        console.log(plays)
        res.render('userHome', {plays})
    }
});

module.exports = router;