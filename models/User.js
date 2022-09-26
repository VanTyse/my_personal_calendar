const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    }
}, {timestamps: true})


UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword;
    
})

UserSchema.methods.comparePassword = async function(password){
    const samePassword = await bcrypt.compare(password, this.password)
    return samePassword
}

module.exports = mongoose.model('User', UserSchema)