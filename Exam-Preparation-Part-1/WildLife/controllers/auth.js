const { mapErrors } = require('../services/util');

module.exports = {
    register(req, res) {
        res.render('register')
    },

    async registerPost(req, res) {
        const data = req.body

        if (Object.values(req.body).some(field => field == undefined || field == '') == true) {
            return res.render('register', { error: 'All fields required' })
        }
        if (data.password != data.repass) {
            return res.render('register', { error: 'Password don\'t match' })
        }
        try {
            await req.auth.register(data.firstName, data.lastName, data.email, data.password,)
            res.redirect('/')
        } catch (err) {
            return res.render('register', { error: `${err.message}` })
        }
    },

    login(req, res) {
        res.render('login')
    },

    async loginPost(req, res) {
        const data = req.body

        if (data.email == '' || data.password == '') {
            return res.render('login', { error: 'All filds required' })
        };
        try {
            await req.auth.login(data.email, data.password)
            res.redirect('/')
        } catch (err) {
            const errors = mapErrors(err)

            return res.render('login', { errors })
        };
    },
    
    async logout(req, res) {
        delete req.session.user
        res.redirect('/')
    },
};