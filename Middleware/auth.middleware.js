const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const checkAuth = (req, res, next) => {// check if user is already login or not
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, 'this is secret to prevent hacking', (error, decodedToken) => {
            if(error) { 
                //console.log(error);
                res.redirect('/login')
            } else{
                //console.log(decodedToken);
                next()
            }
        })
    } else {
        console.log('your must firstly creat an account');
        res.redirect('/login')
    }
}

const isAuth = (req, res, next) => { // create local variable that check if user is or not auth
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, 'this is secret to prevent hacking', async (error, decodedToken) => {
            if(error) { // that mean that no token => user is not auth
                console.log(error.message);
                res.locals.user = null
                next()
            } else{ // that mean that there is token => user is auth
                console.log(decodedToken.id);
                const user = await User.findOne({_id: decodedToken.id})
                console.log(user);
                res.locals.user = user
                next()
            }
        })
    } else {
        console.log('your must firstly creat an account');
        res.locals.user = null;
        next()
    }
}

module.exports = {checkAuth, isAuth};