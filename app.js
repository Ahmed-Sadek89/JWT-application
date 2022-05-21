// required dependencies
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

// required routes
const authRoutes = require('./Routes/auth.route')

// middleware
const {isAuth, checkAuth} = require('./Middleware/auth.middleware')

// settings
app.use(express.json())
app.use(cookieParser())
app.use(express.static('Public'));
app.use(express.static('Images'));
app.set('view engine', 'ejs');
app.set('views', 'Views')

// connect to database => JWT
const db_url = 'mongodb://localhost:27017/JWT';
mongoose.connect(db_url)
.then(() => {
    const port = process.env.PORT | 3000
    app.listen(port, () => {
        console.log('server worked on port '+ port);
    })
})
.catch(error => {
    console.log(error);
})

// routes
app.all("*", isAuth)
app.get('/', (req, res) => {
    res.render('home', {
        title: 'home'
    })
})
app.get('/smoothies', checkAuth, (req, res) => {
    res.render('smoothies', {
        title: 'smoothies'
    })
});
app.use(authRoutes)

