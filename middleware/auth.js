const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const authMiddleWare = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({msg: 'unauthorized'})
    const decodedToken = await jsonwebtoken.verify(token, process.env.JWT_SECRET)
    const {name, userID} = decodedToken
    req.user = {name, userID}
    next()
}

module.exports = authMiddleWare