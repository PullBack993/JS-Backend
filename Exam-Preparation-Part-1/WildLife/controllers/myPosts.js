module.exports = {
    async myPosts(req, res) {
        try {
            const posts = await req.storage.getByAuthorId(req.session.user.id)
            console.log(posts)
            res.render('my-posts', { posts })
        } catch (err) {
            console.log(err)
            throw new Error('Database error!')
        }
    }
};