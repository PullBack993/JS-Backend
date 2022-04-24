module.exports = {
    async details(req, res) {
        const postId = req.params.id

        try {
            const post = await req.storage.getById(postId)
            const author = await req.auth.getUserById(post.author)
            post.firstName = author.firstName
            post.lastName = author.lastName
            
            if (req.session.user) {
                post.hasUser = true

                if (req.session.user.id == post.author._id) {
                    post.hasOwner = true
                } else {
                    post.hasVoted = post.votes.find(v => v._id == req.session.user.id) != undefined
                }
            } else {
                post.hasUser = false
            }
            res.render('details', { post })

        } catch (err) {
            console.log(err)
            throw new Error('Error processing!')
        }
    }
};