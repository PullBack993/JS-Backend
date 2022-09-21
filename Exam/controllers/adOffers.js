const router = require('express').Router()

const { isUser,isOwner,mapErrors } = require('../middleware/guards')
const { create, getAll,getById,deleteById,updateById,apply,getSearch } = require('../services/adServices')

router.get('/create', isUser(), (req, res) => {
    res.render('create')
});

router.post('/create', isUser(), async (req, res) => {
    try {
        const data = req.body;
        data.author = req.session.user;
        await create(data)
        res.redirect('/ads')
    } catch (err) {
        const errors = mapErrors(err)
        res.render('create', { errors });
    }
});

router.get('/ads', async (req, res) => {
    try {
        const data = await getAll();
        res.render('all-ads', {data})
    } catch (err) {
        const errors = mapErrors(err)
        res.render('all-ads', { errors });
    }
});

router.get('/details', async (req, res) => {
    res.render('details')
})

router.get('/details/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await getById(id)
        data.candidates = data.userApplied.length
        if (req.session.user != undefined) {
            data.isUser = true;
            data.isApply = data.userApplied.find(b => b._id == req.session.user._id) != undefined;

            if (data.author._id == req.session.user._id) {
                data.isOwner = true
            } else {
                data.isOwner = false;
            }
        } else {
            data.isUser = false;
        }
        res.render('details', { data })
    } catch (err) {
        const errors = mapErrors(err)
        console.log(err)
        res.render('details', { errors });
    }
});

router.get('/delete/:id',isOwner(), async (req, res) => {
    try {
        await deleteById(req.params.id)
        res.redirect('/ads')
    } catch (err) {
        console.log(err)
        throw new Error('Error in database! Please try again')
    }
});

router.get('/edit/:id',isOwner(), async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getById(id);
        res.render('edit', { data })
    } catch (err) {
        const errors = mapErrors(err)
        res.render('edit', { errors });
    }
});

router.post('/edit/:id',isOwner(), async (req, res) => {
    try {
        const updateData = req.body
        const id = req.params.id

        await updateById(id, updateData)
        res.redirect(`/details/${id}`)
    } catch (err) {
        const errors = mapErrors(err)
        res.render(`edit`, { errors, data: {_id: req.params.id, headline: req.body.headline, location: req.body.location, name: req.body.name, description: req.body.description}});
    }
})

router.get('/apply/:id', isUser(), async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.session.user._id
        await apply(id, userId)
        res.redirect(`/details/${id}`)
    } catch (err) {
        const id = req.params.id
        const errors = mapErrors(err)
        
        res.render(`/details/${id}`, {data:req.body, errors });
    }
})

router.get('/search', isUser(), async (req, res) => {
    res.render('search')
});

router.post('/search', isUser(), async (req, res) => {
    try {
        const data = await getSearch(req.body.search);
        const allData = []
        data.forEach(element => {
            allData.push(element)
        });
      
        res.render('search', {allData})
    } catch (err) {
        const errors = mapErrors(err)
        res.render('search', { errors })
    }
});

module.exports = router;