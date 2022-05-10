const { isUser } = require('../middleware/guards');
const {getLastTree,getSearch} = require('../services/home')

const router = require('express').Router();


router.get('/', async(req, res) => {
    const recentsHouses = await getLastTree()
    res.render('home', {recentsHouses})
});


router.get('/search', isUser(), (req, res) => {
    res.render('search')
});

router.post('/search', isUser(), async (req, res) => {
    const find = await getSearch(req.body.search)
    res.render('search', { find })
});

router.get('*', (req, res) => {
    res.render('404')
});

module.exports = router;