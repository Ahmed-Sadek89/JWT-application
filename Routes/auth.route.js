const {Router} = require('express');
const router = Router();
const {
    get_login, post_login, get_Signup, post_signup, logout
} = require('../Controllers/auth.controller');


router.get('/login', get_login);
router.post('/login', post_login);

router.get('/signup', get_Signup);
router.post('/signup', post_signup)

router.all('/logout', logout)

module.exports = router