module.exports = {
    async voteUp(req, res) {
        const postId = req.params.id
        const userId = req.session.user.id
        await req.storage.voteById('up', postId, userId)
        res.redirect(`/details/${postId}`)
    },
    async voteDown(req, res) {
        const postId = req.params.id
        const userId = req.session.user.id

        await req.storage.voteById('down', postId, userId)
        res.redirect(`/details/${postId}`)
    }
};