const { isUser, isOwner, mapErrors } = require('../middleware/guards');
const { create, getAll, getById, deleteById, updateById, addPassenger } = require('../services/galleryServices');

const router = require('express').Router();

router.get('/create', isUser(), (req, res) => {
    res.render('create')
});

router.post('/create', isUser(), async (req, res) => {
    try {
        const data = req.body;
        data.author = req.session.user;
        data.certificate = data.certificate.toLowerCase();
        await create(data)
        res.redirect('/catalog')
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

router.get('/details/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await getById(id)
        if (req.session.user != undefined) {
            data.isUser = false;
            data.isShared = data.usersShared.find(b => b._id == req.session.user._id) != undefined;
            if (data.author._id == req.session.user._id) {
                data.isOwner = true
            } else {
                data.isOwner = false;
            }
        } else {
            data.isUser = true;
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
        res.redirect('/catalog')
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
        res.render(`edit`, { errors });
    }
});

router.get('/share/:id', isUser(), async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.session.user._id
        await addPassenger(id, userId);
        res.redirect(`/details/${id}`)
    } catch (err) {
        res.redirect('/404', { err })
    }
});

module.exports = router;