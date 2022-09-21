const User = require('../models/User');
const Ad = require('../models/Ad');

async function create(data) {
    const ad = new Ad(data);
    await ad.save();

    const user = await User.findById(ad.author._id)
    user.ads.push(ad)
    user.save()
};


async function getAll() {
    return await Ad.find({}).lean();
};
async function getById(id) {
    return await Ad.findById(id).populate('author').populate('userApplied').lean();
};

async function deleteById(id) {
    await Ad.findByIdAndDelete(id);
};

async function updateById(id, data) {
    const current = await Ad.findById(id)
    if (!current) {
        throw new Error('Could not find this ID in database')
    }
    Object.assign(current, data)
    return current.save()
};


async function getLastTree() {
    return await Ad.find().limit(3).lean();
};

async function apply(id, userId) {
    const currentAd = await Ad.findById(id);
    currentAd.userApplied.push(userId)
    return await currentAd.save();
};

async function getSearch(query) {
    const userAds = await User.find({ 'email': { $regex: `${query}`, $options: 'i' } }).populate('ads').lean()
    return userAds 
    // Product.find({ name: { $regex: 'sorv', $options: 'i'}})
};

module.exports = {
    create,
    getAll,
    getById,
    deleteById,
    updateById,
    getLastTree,
    getSearch,
    apply
}