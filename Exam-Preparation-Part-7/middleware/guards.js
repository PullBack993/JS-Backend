const { getById } = require('../services/course');

function isUser() {
    return (req, res, next) => {
        if (req.session.user != undefined) {
            next();   
        } else {
            res.redirect('/login');
        }
    }
};

function isGuest() {
    return (req, res, next) => {
        if (req.session.user == undefined) {
            next();
        } else {
            res.redirect('/')
        }
    }
};

function isOwner() {
    return async (req, res, next) => {
        const id = req.params.id
        if (id) {
            try {
                const id = req.params.id
                const trip = await getById(id)
                if ((req.session.user && trip) && (trip.owner._id == req.session.user._id)) {
                    next();
                } else {
                    res.redirect('/login')
                };

            } catch (err) {
                console.log(err)
                res.redirect('/login')
            }
        }
    }
};

function mapErrors(err) {
    if (Array.isArray(err)) {
        return err
    } else if (err.name == 'ValidationError') {
        return Object.values(err.errors).map(e => ( { msg: e.message }) );
    } else if (typeof err.message == 'string') {
        return [{ msg: err.message }];
    } else {
        return [{msg:'Request error'}]
    }
};

module.exports = {
    isUser,
    isGuest,
    isOwner,
    mapErrors
};