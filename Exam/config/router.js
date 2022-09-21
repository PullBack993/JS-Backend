const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const adOffersController = require('../controllers/adOffers');

module.exports = (app) => {
    app.use(authController);
    app.use(adOffersController);
    
    app.use(homeController);
};