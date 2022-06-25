const Publication = require('../models/Publication');
const User = require('../models/User');

async function create(data) {
    const publication = new Publication(data);
    await publication.save();
    const user = await User.findById(publication.author)
    console.log(user.myPublications)
    user.myPublications.push(publication)
    user.save()
};

async function getAll() {
    return await Publication.find().lean();
};
async function getById(id) {
    return await Publication.findById(id).populate('usersShared').populate('author').lean();
};

async function deleteById(id) {
    await Publication.findByIdAndDelete(id);
};

async function updateById(id, data) {
    const current = await Publication.findById(id)

    if (!current) {
        throw new Error('Could not find this ID in database')
    }
    Object.assign(current, data)
    return current.save()
};

async function addPassenger(id, userId) {
    const currentData = await Publication.findById(id);
    currentData.usersShared.push(userId)
    await currentData.save();
};

async function getUserShared(userId) {
    return await Publication.find().where({ usersShared: userId })
};

module.exports = {
    create,
    getAll,
    getById,
    deleteById,
    updateById,
    addPassenger,
    getUserShared,
}