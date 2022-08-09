const { getData } = require('../middleware/common');
const { isUser, isOwner, mapErrors } = require('../middleware/guards');
const { create, getById, deleteById, updateById,enrolled, seachByTitle } = require('../services/course');

const router = require('express').Router();

router.get('/create', isUser(), (req, res) => {
    res.render('create')
});

router.post('/create', isUser(), async (req, res) => {
    try {
        const data = req.body;
        data.owner = req.session.user._id
        data.created = getData()
        await create(data)
        res.redirect('/')
    } catch (err) {
        const errors = mapErrors(err)
        res.render('create', { errors });
    }
});

router.get('/details', async (req, res) => {
    res.render('details')
});

router.get('/details/:id',isUser(), async (req, res) => {
    try {
        const id = req.params.id
        const data = await getById(id)
        data.isEnroll = data.enrolled.find(b => b._id == req.session.user._id) != undefined;
            if (data.owner._id == req.session.user._id) {
                data.isOwner = true
            } else {
                data.isOwner = false;
            }
        res.render('details', { data })
    } catch (err) {
        const errors = mapErrors(err)
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
        await updateById(id, updateData)
        res.redirect(`/details/${id}`)
    } catch (err) {
        const errors = mapErrors(err)
        res.render('user-home', { errors });
    }
});

router.get('/enroll/:id', isUser(), async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.session.user._id
        await enrolled(id, userId);
        res.redirect(`/details/${id}`)
    } catch (err) {
        res.render('user-home', { errors });
    }
});

router.post('/seach', isUser(), async (req, res) => {
    try {
        const data = await seachByTitle(req.body.search);
        console.log(data)
        res.render('user-home', {data})
    } catch (err) {
        const errors = mapErrors(err)
        res.render('user-home', { errors })
    }
});

module.exports = router;