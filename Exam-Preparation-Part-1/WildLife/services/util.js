function isUser() {
    return function (req, res, next) {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/login')
        }
    }
};

function isGuest() {
    return function (req, res, next) {
        if (req.session.user) {
            res.redirect('/')
        } else {
            next();
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
    mapErrors,
}