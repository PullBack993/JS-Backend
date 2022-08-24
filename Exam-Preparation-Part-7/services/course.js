const Course = require('../models/Course');

async function create(data) {
    const title = data.title
        const existing = await Course.findOne({title})

    if (existing) {
        throw new Error('Title is taken')
    }
    const course = new Course(data);
    await course.save();
};

async function getAll() {
    return await Course.find({}).sort('-created').lean();
};

async function getById(id) {
    return await Course.findById(id).lean();
};

async function deleteById(id) {
    await Course.findByIdAndDelete(id);
};

async function updateById(id, data) {
    const current = await Course.findById(id)

    if (!current) {
        throw new Error('Could not find this ID in database')
    }
    Object.assign(current, data)
    return current.save()
};

async function enrolled(id, userId) {
    const currentCourse = await Course.findById(id);

    currentCourse.enrolled.push(userId)
    await currentCourse.save();
};

async function getLastTree() {
    return await Course.find().sort({ field: 'desc', enrolled: -1 }).limit(3).lean();
};

async function seachByTitle(query) {
    return await Course.find({ title: { $regex: `${query}`, $options: 'i'}},).lean();
};

module.exports = {
    create,
    getAll,
    getById,
    deleteById,
    updateById,
    enrolled,
    getLastTree,
    seachByTitle,
}
