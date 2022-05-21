const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
        lowercase: true,
        validate: [isEmail, 'invalid email']
    },
    password: {
        type: String,
        minlength: [3, 'min length of password is 3'],
        required: [true, 'password is required'],
    }
})
// run a function before saving doc
userSchema.pre( 'save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    console.log('loading...'+ this);
    console.log('##############')
    next()
})

// run a function after saving doc
userSchema.post('save', function(doc, next){ 
    console.log('document ' + doc + " added successfully");
    console.log('##############')
    next()
})

// create a static function to check user_login
userSchema.statics.checkLogin = async function(email, password) {
    const user = await User.findOne({email})
    if(user) {
        const passwordCheck = await bcrypt.compare(password, user.password);
        if(passwordCheck) {
            return user
        } else {
            throw Error('this password is incorrect')
        }
    } else {
        throw Error('this email is not found')
    }

}
const User = mongoose.model('user', userSchema);

module.exports = User