const Post = require('../models/Post')
const User = require('../models/User');

module.exports = () => (req, res, next) => {
    req.storage = {
        getAll,
        getById,
        editById,
        create,
        voteById,
        deleteById,
        getByAuthorId,
    };
    next();
    async function getByAuthorId(userId) {
        return await Post.find({ author: userId }).populate('author').lean()
    }

    async function getAll() {
        const data = await Post.find().lean()
        return data
    }

    async function create(data, userId) {
        const currentUser = await User.findById(userId)

        if (!currentUser) {
            throw new Error('Could not find this ID in database')
        }
        const post = new Post(data)
        await post.save()
        currentUser.myPosts.push(post)

        await currentUser.save()
    }

    async function getById(id) {
        const data = await Post.findById(id).populate('votes').lean()
        if (data) {
            return data
        } else {
            return undefined
        }
    }

    async function editById(id, data) {
        const existing = await Post.findById(id)
        
        if (existing) {
            existing.title = data.title;
            existing.keyword = data.keyword;
            existing.location = data.location;
            existing.dataOfCreation = data.dataOfCreation;
            existing.image = data.image;
            existing.description = data.description;
            existing.author;

            return existing.save()
        } else {
            return undefined
        }
    }
    async function voteById(voteType, id, userId) {
        const currentPost = await Post.findById(id)

        if (!currentPost || !userId) {
            throw new Error('Error in database,post or user not found')
        }
        if (voteType == 'up') {
            currentPost.rating += 1;
        } else {
            currentPost.rating -= 1;
        };
        await currentPost.votes.push(userId);
        return currentPost.save();
    }

    async function deleteById(id) {
        return await Post.findOneAndDelete(id)
    }
};