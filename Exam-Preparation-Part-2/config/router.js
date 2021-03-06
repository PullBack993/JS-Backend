const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const tripController = require('../controllers/trip');


module.exports = (app) => {
    app.use(tripController);
    app.use(authController);
    app.use(homeController);
};