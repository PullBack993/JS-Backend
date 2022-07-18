const { isUser, isOwner, mapErrors } = require('../middleware/guards');
const { create, getAll, getById, deleteById, updateById,likePlay, sortByDate, sortByLikes } = require('../services/play');

const router = require('express').Router();

router.get('/create', isUser(), (req, res) => {
    res.render('create')
});

router.post('/create', isUser(), async (req, res) => {
    try {
        const data = req.body;
        data.owner = req.session.user._id
        data.created = Date.now()
        await create(data)
        res.redirect('/')
    } catch (err) {
        const errors = mapErrors(err)
        res.render('create', { errors });
    }
});

router.get('/catalog', async (req, res) => {
    try {
        const data = await getAll();
        res.render('catalog', {data})
    } catch (err) {
        const errors = mapErrors(err)
        res.render('404', { errors });
    }
});

router.get('/details', async (req, res) => {
    res.render('details')
});

router.get('/details/:id',isUser(), async (req, res) => {
    try {
        const id = req.params.id
        const data = await getById(id)
        data.isLiked = data.liked.find(b => b._id == req.session.user._id) != undefined;
            if (data.owner._id == req.session.user._id) {
                data.isOwner = true
            } else {
                data.isOwner = false;
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
        res.redirect('/')
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

router.post('/edit/:id', isOwner(), async (req, res) => {
    try {
        const updateData = req.body
        const id = req.params.id
        if (updateData.isPublic == undefined) {
            updateData.isPublic = false
        }
        await updateById(id, updateData)
        res.redirect(`/details/${id}`)
    } catch (err) {
        const errors = mapErrors(err)
        res.render(`edit`, { errors, offer: req.body });
    }
});

router.get('/like/:id', isUser(), async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.session.user._id
        await likePlay(id, userId);
        res.redirect(`/details/${id}`)
    } catch (err) {
        res.redirect('/', { err })
    }
});

router.get('/sort-date', isUser(), async (req, res) => {
    try {
        const plays = await sortByDate();
        console.log(plays)
        plays.map(p => p.liked = p.liked.length)
        res.render('userHome', {plays})
    } catch (err) {
        const errors = mapErrors(err)
        res.redirect('/', { errors })
    }
});

router.get('/sort-likes', isUser(), async (req, res) => {
    try {
        const plays = await sortByLikes();
        plays.map(p => p.liked = p.liked.length)
        res.render('userHome', {plays})
    } catch (err) {
        const errors = mapErrors(err)
        res.redirect('/', { errors })
    }
});

module.exports = router;