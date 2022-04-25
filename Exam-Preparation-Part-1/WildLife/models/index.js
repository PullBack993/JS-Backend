const mongoose = require("mongoose");

require('./Post')
require('./User')

const connectionString = 'mongodb://localhost:27017/wildlife'

async function init() {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connection');
        
        mongoose.connection.on('error', (err) => {
            console.error('Database error');
            console.error(err);
        })
    } catch (err) {
        console.error('Error connection to database');
        process.exit(1);
    }
};


module.exports = init;