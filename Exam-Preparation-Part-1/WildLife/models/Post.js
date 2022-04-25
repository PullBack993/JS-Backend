const { Schema, model } = require('mongoose');

const URL_PATTERN = /^https?.\/\/(.+)/;

const postSchema = new Schema({ 
    title: { type: String, minlength: [6, 'Title muss be at least 6 characters long'] },
    keyword: { type: String, minlength: [6, 'Keyword muss be at least 6 characters long'] },
    location: { type: String, maxlength: [15, 'Location muss be maximum 15 characters long'] },
    
    dataOfCreation: {
        type: String, required: true,
        minlength: [10, 'Data must be 10 characters long'],
        maxlength: [10, 'Data must be at least 10 characters']
    },

    image: {
        type: String, required: true, validate: {
            validator(value) {
                return URL_PATTERN.test(value)
            },
            message: 'Image must be a valid URL'
        }
    },
    
    description: { type: String, required: true,minlength: [8, 'Data must be at least 8 characters long'] },
    author: { type:  Schema.Types.ObjectId, ref: 'User' },
    votes:[{ type:  Schema.Types.ObjectId, ref: 'User'}],
    rating: {type: Number, default: '0'}
})
const Post = model('Post', postSchema);

module.exports = Post;
