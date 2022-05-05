const Trip = require('../models/Trip');
const User = require('../models/User');

async function createTrip(data) {
    const trip = new Trip(data);
    await trip.save();
    console.log(trip._id);

    const user = await User.findById(trip.creator);
    user.tripsHistory.push(trip);
    await user.save();
};

async function getAll() {
    return await Trip.find({}).lean();
};

async function getById(id) {
    return await Trip.findById(id)?.populate('creator')?.populate('buddie').lean();
};

async function deleteById(id) {
    await Trip.findOneAndDelete(id);
};

async function updateById(id,data) {
    const current = await Trip.findById(id);

    if (!current) {
        throw new Error('Could not find this ID in database');
    }
    Object.assign(current, data);
    return current.save();
};

async function addPassenger(tripId, userId) {
    const currentTrip = await Trip.findById(tripId);
    currentTrip.buddie.push(userId);
    currentTrip.seats -= 1
    await currentTrip.save();
}

module.exports = {
    createTrip,
    getAll,
    getById,
    deleteById,
    updateById,
    addPassenger,
};