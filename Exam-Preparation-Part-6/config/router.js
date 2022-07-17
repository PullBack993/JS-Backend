const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const offersController = require('../controllers/offers');

module.exports = (app) => {
    app.use(authController);
    app.use(offersController);
    app.use(homeController);
};