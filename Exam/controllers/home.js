const {getLastTree} = require('../services/adServices')
const router = require('express').Router();


router.get('/', async(req, res) => {
    const data = await getLastTree()
    data.map(p => p.candidates = p.userApplied.length)
    console.log(data)
    res.render('home', {data})
    
});


router.get('*', (req, res) => {
    res.render('404')
})

module.exports = router;