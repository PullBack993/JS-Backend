const { isUser, isOwner, mapErrors } = require('../middleware/guards');
const { create, getById, deleteById, updateById, addPassenger } = require('../services/hotelSer');

const router = require('express').Router();

router.get('/create', isUser(), (req, res) => {
    res.render('create')
});

router.post('/create', isUser(), async (req, res) => {
    try {
        const data = req.body;
        data.owner = req.session.user;
        await create(data)
        res.redirect('/')
    } catch (err) {
        console.log(err)
        const errors = mapErrors(err)
        res.render('create', { errors });
    }
});

router.get('/details/:id',isUser(), async (req, res) => {
    try {
        const id = req.params.id
        const data = await getById(id)
        data.isRented = data.booked.find(b => b._id == req.session.user._id) != undefined;
            if (data.freeRooms <= 0) {
                data.isPlace = false
            } else {
                data.isPlace = true
            }
            if (data.owner._id == req.session.user._id) {
                data.isOwner = true
            } else {
                data.isOwner = false;
        }
        res.render('details', { hotel:data })
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

router.get('/edit/:id' ,isOwner(), async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getById(id);
        res.render('edit', { hotel: data })
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
        const errors = mapErrors(err)
        res.redirect('/', { errors })
    }
});

module.exports = router;