const mongoose = require('mongoose');
//TODO Change name of DB
const dbName = 'Job'

const connectionString = `mongodb://localhost:27017/${dbName}`

module.exports = async (app) => {
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
}
