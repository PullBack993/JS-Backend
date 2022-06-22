const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const galleryController = require('../controllers/gallery');

module.exports = (app) => {
    app.use(authController);
    app.use(galleryController);
    app.use(homeController);
};