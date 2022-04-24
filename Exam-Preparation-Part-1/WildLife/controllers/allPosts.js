module.exports = {
    async allPosts(req, res) {
        const posts = await req.storage.getAll()
        res.render('all-posts', { posts })
    }
};