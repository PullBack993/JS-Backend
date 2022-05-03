const { isUser, isOwner, mapErrors } = require('../middleware/guards');
const { createTrip, getAll, getById, deleteById, updateById, addPassenger } = require('../services/trip');

const router = require('express').Router();

router.get('/create', isUser(), (req, res) => {
    res.render('trip-create')
});

router.post('/create', isUser(), async (req, res) => {
    try {
        const data = req.body;
        data.creator = req.session.user;
        await createTrip(data)
        res.redirect('/catalog')
    } catch (err) {
        const errors = mapErrors(err)
        res.render('trip-create', { errors });
    }
});

router.get('/catalog', async (req, res) => {
    try {
        const tripsOffer = await getAll();
        res.render('shared-trips', { tripsOffer })
    } catch (err) {
        const errors = mapErrors(err)
        res.render('404', { errors });
    }
});

router.get('/details/:id', async (req, res) => {
    try {
        const id = req.params.id
        const trip = await getById(id)

        if (req.session.user != undefined) {
            trip.isUser = true;
            trip.isJoined = trip.buddie.find(b => b._id == req.session.user._id) != undefined;

            if (trip.seats <= 0) {
                trip.isPlace = false
            } else {
                trip.isPlace = true
            }
            if (trip.creator._id == req.session.user._id) {
                trip.isOwner = true
            } else {
                trip.isOwner = false;
            }
        } else {
            trip.isUser = false;
        }
        trip.buddie = trip.buddie.map(b => b.email).join(', ')
        res.render('trip-details', { trip })
    } catch (err) {
        const errors = mapErrors(err)
        console.log(err)
        res.render('trip-details', { errors });
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
        const trip = await getById(id);
        res.render('edit', { trip })
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
        res.render(`edit`, { errors, trip: req.body });
    }
});

router.get('/join/:id', isUser(), async (req, res) => {
    try {
        const tripId = req.params.id
        await addPasse
        nger(tripId);
        res.redirect('/catalog')
    } catch (err) {
        console.log(err)
        res.redirect('/404')
    }
});

module.exports = router;