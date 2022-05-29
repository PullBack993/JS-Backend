module.exports = () => (req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
        res.locals.name = req.session.user.username;
        res.locals.user = true;
    }
    next();
};