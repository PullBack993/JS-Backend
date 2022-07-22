const Play = require('../models/Play');

async function create(data) {
    const title = data.title
    const existing = await Play.findOne({ title })
    
    if (existing) {
        throw new Error('Title is taken')
    }
    const play = new Play(data);
    await play.save();
};

async function getAll() {
    return await Play.find({}).sort({ field: 'desc', liked: -1 }).lean();
};

async function getById(id) {
    return await Play.findById(id).lean();
};

async function deleteById(id) {
    await Play.findByIdAndDelete(id);
};

async function updateById(id, data) {
    const current = await Play.findById(id)

    if (!current) {
        throw new Error('Could not find this ID in database')
    }
    Object.assign(current, data)
    return current.save()
};

async function likePlay(id, userId) {
    const currentTrip = await Play.findById(id);
    currentTrip.liked.push(userId)
    await currentTrip.save();
};

async function getLastTree() {
    return await Play.find({isPublic:true}).sort({ field: 'desc', liked: -1 }).limit(3).lean();
};

async function sortByLikes() {
    return await Play.find().sort({ field: 'desc', liked: -1 }).lean();
};

async function sortByDate() {
    return await Play.find({}).sort({ field: 'desc', created: -1 }).lean();
};

module.exports = {
    create,
    getAll,
    getById,
    deleteById,
    updateById,
    likePlay,
    getLastTree,
    sortByLikes,
    sortByDate,
};