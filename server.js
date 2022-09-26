require('express-async-errors');
require('dotenv').config()
const express = require('express');
const connectDB = require('./db/connectDB');
const errorHandlerMiddleware = require('./middleware/error-handler');
const session = require('express-session')
const passport = require('passport')
const cookieParser = require('cookie-parser');

//initialize express app
const app = express()
app.use(cookieParser())
app.use(express.json())

//passport config
const passportConfig = require('./configs/passport')
passportConfig(passport)



const eventRoutes = require('./routes/events')
const authRoutes = require('./routes/auth')


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/event', eventRoutes)

app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5001
const MONGO_URI = process.env.MONGO_URI


const start = async () => {
    try {
        await connectDB(MONGO_URI)
        console.log('db connected ')
        app.listen(PORT, console.log(`server is listening on port ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

start()


