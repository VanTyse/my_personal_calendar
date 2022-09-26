const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    desc: {
        type: 'string',
        required: [true, 'wetin be the event abeg']
    },

    date : {
        type: 'number',
        required: [true, 'omo you gats include date oh']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    }

}, {timestamps: true})

const model = mongoose.model('event', eventSchema)

module.exports = model