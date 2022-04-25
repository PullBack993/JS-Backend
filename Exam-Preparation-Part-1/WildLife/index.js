const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');
const initDb = require('./models');
const auth = require('./services/auth');
const posts = require('./services/posts');

const {isUser,isGuest} = require('./services/util')
const { allPosts } = require('./controllers/allPosts');
const { create, createPost } = require('./controllers/create');
const { details } = require('./controllers/details');
const { home } = require('./controllers/home');
const { edit,editPost } = require('./controllers/edit');
const { register,registerPost,login,loginPost,logout } = require('./controllers/auth');
const { myPosts } = require('./controllers/myPosts');
const { notFound } = require('./controllers/notFound');
const { deletePost } = require('./controllers/deletePost');
const { voteUp,voteDown } = require('./controllers/vote');

start()
async function start() {
    await initDb();
    const app = express()

    app.engine('hbs', hbs.create({
        extname: '.hbs',
    }).engine);
    app.set('view engine', 'hbs');

    app.use(session({
        secret: 'secret key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto' },
    }));

    app.use(express.urlencoded({ extended: true }));
    app.use('/static', express.static('static'));
    app.use(auth());
    app.use(posts());
    
    app.get('/', home);

    app.route('/voteup/:id')
        .get(isUser(), voteUp);
    
    app.route('/voteDown/:id')
        .get(isUser(), voteDown);  
    
    app.route('/create')
        .get(isUser(), create)
        .post(isUser(), createPost);
    
    app.get('/allPosts', allPosts)
    app.get('/delete/:id', isUser(), deletePost);

    app.route('/details/:id')
    .get(details);
    
    app.get('/myPosts', isUser(), myPosts);

     app.route('/edit/:id')
        .get(isUser(),edit)
        .post(isUser(),editPost);

    app.route('/register')
        .get(isGuest(),register)
        .post(isGuest(),registerPost);
    
    app.route('/login')
        .get(isGuest(), login)
        .post(isGuest(), loginPost);


    app.get('/logout', isUser(), logout);
    app.all('*', notFound);
    app.listen(3000, () => console.log('Server started on port 3000'));
};
