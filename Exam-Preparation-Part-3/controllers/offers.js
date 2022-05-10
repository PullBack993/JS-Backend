const router = require('express').Router()

const { isUser, isOwner, mapErrors } = require('../middleware/guards');
const { create, getAll, getById, deleteById, updateById, addPassenger } = require('../services/home');

router.get('/create', isUser(), (req, res) => {
    res.render('create')
});

router.post('/create', isUser(), async (req, res) => {
    try {
        const data = req.body;
        data.owner = req.session.user;
        data.type = data.type.toLowerCase();
        console.log(data)
        await create(data)
        res.redirect('/catalog')
    } catch (err) {
        const errors = mapErrors(err)
        res.render('create', { errors });
    }
});

router.get('/catalog', async (req, res) => {
    try {
        const recentsHouses = await getAll();
        res.render('catalog', {recentsHouses})
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
        const currentOffer = await getById(id)
        if (req.session.user != undefined) {
            currentOffer.isUser = true;
            currentOffer.isRented = currentOffer.rentedHome.find(b => b._id == req.session.user._id) != undefined;
            if (currentOffer.available <= 0) {
                currentOffer.isPlace = false
            } else {
                currentOffer.isPlace = true
            }
            if (currentOffer.owner._id == req.session.user._id) {
                currentOffer.isOwner = true
            } else {
                currentOffer.isOwner = false;
            }
        } else {
            currentOffer.isUser = false;
        }
        currentOffer.rentedHome = currentOffer.rentedHome.map(b => b.username).join(', ')
        res.render('details', { currentOffer })
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
        const offer = await getById(id);
        res.render('edit', { offer })
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
        console.log(id)
        res.redirect(`/details/${id}`)
    } catch (err) {
        const errors = mapErrors(err)
        res.render(`edit`, { errors, offer: req.body });
    }
});

router.get('/rent/:id', isUser(), async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.session.user._id
        await addPassenger(id, userId);
        res.redirect(`/details/${id}`)
    } catch (err) {
        console.log(err)
        res.redirect('/404')
    }
});

module.exports = router;