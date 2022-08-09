const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const coursesController = require('../controllers/course');

module.exports = (app) => {
    app.use(authController);
    app.use(coursesController);
    app.use(homeController);

};