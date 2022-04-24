const { mapErrors } = require('../services/util');

module.exports = {
    create(req, res) {
        res.render('create')
    },

    async createPost(req, res) {
        const data = req.body
        const post = {
            title: data.title,
            keyword: data.keyword,
            location: data.location,
            dataOfCreation: data.dataOfCreation,
            image: data.image,
            description: data.description,
            author: req.session.user.id,
        };
        try {
            await req.storage.create(post, req.session.user.id)
            res.redirect('/')
        } catch (err) {
            const errors = mapErrors(err)
            res.render('create', { errors })
        }
    }
};