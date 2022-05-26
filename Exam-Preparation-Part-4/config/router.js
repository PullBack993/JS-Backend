const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const bookingController = require('../controllers/hotel');

module.exports = (app) => {
    app.use(authController);
    app.use(bookingController);
    app.use(homeController);
};