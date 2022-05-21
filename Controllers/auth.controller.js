const User = require('../Models/User');
const jwt = require('jsonwebtoken');


const handleError = (error) => {
    const errorCode = error.code
    const errors = {email: '', password: ''}
    console.log({ error: error.message, errorCode});

    // check login errors
    if ( error.message === 'this email is not found' ) {  
        errors.email = 'this email is not found';
    }
    if ( error.message === 'this password is incorrect' ) { 
        errors.password = 'this password is incorrect';
    }

    // check signup errors
    if(errorCode){ // check if email is not unique
        errors.email = 'email must be unique';
    }
    if (error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach( ({properties}) => {
            errors[properties.path] =  properties.message
        })
    }

    return {status: errorCode ? errorCode : 404, errors}
}

const createToken = (id) => {
    return jwt.sign({id}, 'this is secret to prevent hacking', {
        expiresIn: 4 * 24 * 60 * 60
    })
}

const get_login = (req, res) => {
    res.render('login', {
        title: 'login'
    })
}

const post_login = async (req, res) => {
    const { email, password } = req.body
    console.log(res.body)
    try{
        const user = await User.checkLogin( email, password )
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 4 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({status: 200, user: user._id})
    }
    catch(error){
        const errorObject = handleError(error, res);
        res.status(404).json(errorObject)
    }
}

const get_Signup = (req, res) => {
    res.render('signup', {
        title: 'signup'
    })
}

const post_signup = async (req, res) => { 
    const { email, password } = req.body
    try{
        const user = await User.create({ email, password })
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 4 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({status: 200, user})
    }
    catch(error){
        const errorObject = handleError(error, res);
        res.status(404).json(errorObject)
    }
}

const logout = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/')
}

module.exports = {
    get_login, post_login, get_Signup, post_signup, logout
}