const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')

const User = require('../models/User')


module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
            const user = await User.findOne({email})
            if (!user){
                return done(null, false, {message: 'that email is not registered'})
            }
            const samePassword = await bcrypt.compare(password, user.password)
            if (samePassword) {
                return done(null, user)
            }else{
                return done(null, false, {message: 'password incorrect'})
            }
        })
    )
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        let user;
        try {
            user = await User.findById(id)
            done(null, user)
        } catch (error) {
            done(error, user)
        }
        done(null, user._id)
    })
}