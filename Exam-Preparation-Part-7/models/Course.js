const { Schema, model } = require('mongoose');

const URL_PATTERN = /^https?.\/\/(.+)/;

const courseSchema = new Schema({
    title: { type: String, required: [true, 'Title is required!'] },
    description: {
        type: String, minlength: [20, 'Description muss be at least 20 characters long!'],
        maxlength: [50, 'Description muss be maximum 50 characters long!']
    },
    image: {
        type: String, required: [true, 'Image is required!'], validate: {
            validator(value) {
                URL_PATTERN.test(value)
            },
            message: 'Image url must be a valid'
        }
    },
    duration: { type: String, required: [true, 'duration is required!'] },
    created: { type: Date, required: true },
    enrolled: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

courseSchema.index({ title: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Course = model('Course', courseSchema);

module.exports = Course;