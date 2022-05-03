module.exports = () => (req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
        res.locals.user = true;
        res.locals.email = req.session.user.email;
    }
    next();
};