const House = require('../models/House');

async function create(data) {
    const house = new House(data);
    await house.save();
};

async function getLastTree() {
    return await House.find().sort({ field: 'asc', _id: -1 }).limit(3).lean();
};

async function getSearch(query) {
    return await House.find({type : {$regex: `${query}`, $options: 'i'}}).lean()
};

async function getAll() {
    return await House.find({}).lean();
};

async function getById(id) {
    return await House.findById(id)?.populate('rentedHome').lean();
};

async function deleteById(id) {
    await House.findOneAndDelete(id);
};

async function updateById(id,data) {
    const current = await House.findById(id)

    if (!current) {
        throw new Error('Could not find this ID in database')
    }
    Object.assign(current, data)
    return current.save()
};

async function addPassenger(id, userId) {
    const currentTrip = await House.findById(id);

    currentTrip.rentedHome.push(userId)
    currentTrip.available -= 1
    await currentTrip.save();
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