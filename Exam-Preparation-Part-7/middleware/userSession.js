module.exports = () => (req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
        res.locals.user = true;
        res.locals.username = req.session.user.username;
    }
    next();
};