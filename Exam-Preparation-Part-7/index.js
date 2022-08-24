const express = require('express');
const expressConfig = require('./config/express');
const databaseConfig = require('./config/database');
const routerConfig = require('./config/router');


start()
async function start() {

    const app = express();
    expressConfig(app);
    await databaseConfig(app);
    routerConfig(app);

    app.listen(3000, () => console.log('App start in port 3000'));
};