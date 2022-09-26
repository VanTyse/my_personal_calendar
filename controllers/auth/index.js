const User = require('../../models/User')
const passport = require('passport');
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()

const loginController = async (req, res) => {
    const {email, password} = req.body
    if (!password || !email) return res.status(401).json({msg: 'enter name, email and password'})
    const user = await User.findOne({email});

    //the comparePassword was defined in the UserSchema
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) return res.status(401).json({msg: 'invalid credentials'})
    const {name, _id} = user
    const token = jsonwebtoken.sign({ name, userID: _id }, process.env.JWT_SECRET)
    res.cookie('token', token, {maxAge: 3600000})
    res.status(201).json({token})
}

const registerController = async (req, res) => {
    const {name, email, password} = req.body
    if (!name || !email || !password) return res.status(401).json({msg: 'enter name, email and password'})
    if (password.length < 6) return res.status(401).json({msg : 'password should be greater than six characters'})

    const user = await User.findOne({email})
    if (user) return res.status(401).json({msg: 'email already exists'})
    const newUser = await User.create({email, password, name})
    const {_id} = newUser
    const token = jsonwebtoken.sign({ name, userID: _id }, process.env.JWT_SECRET)
    res.cookie('token', token, {httpOnly: true, maxAge: 3600000})//dont forget to make it work only over https on production by using the secure property
    return res.status(201).json({token})
}


module.exports = {registerController, loginController}