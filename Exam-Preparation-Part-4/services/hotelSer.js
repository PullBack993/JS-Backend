const Hotel = require('../models/Hotel');
const User = require('../models/User');

async function create(currentData) {
    const data = new Hotel(currentData);
    const ownerId = data.owner
    await data.save();
    const user = await User.findById(ownerId)
    user.offeredHotels.push(data)
    await user.save()
};

async function getAll() {
    return await Hotel.find({}).sort({ field: 'desc', freeRooms: -1 }).lean();
};

async function getById(id) {
    return await Hotel.findById(id)?.populate('booked').lean();
};

async function deleteById(id) {
    await Hotel.findByIdAndRemove(id)
};

async function updateById(id, data) {
    const current = await Hotel.findById(id)
    if (!current) {
        throw new Error('Could not find this ID in database')
    }
    Object.assign(current, data)
    return current.save()
};

async function addPassenger(id, userId) {
    const current = await Hotel.findById(id);
    current.booked.push(userId)
    current.freeRooms -= 1
    await current.save();

    const user = await User.findById(userId)
    user.bookedHotels.push(current)
    await user.save()
};

async function getLastTree() {
    return await Hotel.find().sort({ field: 'desc', freeRooms: -1 }).lean();
};

async function getSearch(query) {
    return await Hotel.find({type : {$regex: `${query}`, $options: 'i'}}).lean()
};



module.exports = {
    create,
    getAll,
    getById,
    deleteById,
    updateById,
    addPassenger,
    getLastTree,
    getSearch,
};