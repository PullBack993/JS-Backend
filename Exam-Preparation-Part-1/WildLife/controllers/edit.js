module.exports = {
    async edit(req, res) {
        const postId = req.params.id
        try {
            const edit = await req.storage.getById(postId)
            res.render('edit', edit)
        } catch (err) {
            console.log(err.message)
            throw new Error('Error processing!')
        }
    },
    async editPost(req, res) {
        const postId = req.params.id
        console.log(postId)
        const data = req.body
        const post = {
            title: data.title,
            keyword: data.keyword,
            location: data.location,
            dataOfCreation: data.dataOfCreation,
            image: data.image,
            description: data.description,
        };
        try {
            await req.storage.editById(postId, post)
            res.redirect(`/details/${postId}`)
        } catch (err) {
            console.log('it does not work')
            return console.log(err.message)
        }
    }
};