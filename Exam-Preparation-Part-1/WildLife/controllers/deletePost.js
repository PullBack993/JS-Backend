module.exports = {
    async deletePost(req, res) {
        try {
            await req.storage.deleteById(req.params.id)
            res.redirect('/')
        } catch (err) {
            console.log(err)
            throw new Error('Error in database! Please try again')
        }
    }
};