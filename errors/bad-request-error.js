const { StatusCodes } = require('http-status-codes')
const CustomError = require('./custom-error')


class BadRequestError extends CustomError{
    constructor(message){
        super(message)
        this.StatusCodes = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestError
