const { getLastTree, getAll } = require('../services/course');

const router = require('express').Router();

router.get('/', async (req, res) => {
    if (req.session.user == undefined) {
        const data = await getLastTree()
        data.map(c => c.enrolled = c.enrolled.length)
        res.render('guest-home', {data})
    } else {
        const data = await getAll()
        res.render('user-home', {data})
    }
});

module.exports = router;