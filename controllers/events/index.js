const { BadRequestError } = require('../../errors')
const Event = require('../../models/Event')

const createEvent = async (req, res) => {
    const {desc, date} = req.body
    const {userID} = req.user
    const event = await Event.create({desc, date, createdBy: userID})
    if (!event){
        throw new BadRequestError('something went wrong')
    }
    return res.status(200).json(event)
}

const getEvents = async (req, res) => {
    const {userID} = req.user;
    const {date} = req.query;
    let events;
    if (date)events = await Event.find({date, createdBy: userID})
    else events = await Event.find({createdBy: userID})

    if (!events){
        throw new BadRequestError('something went wrong')
    }
    return res.status(200).json(events)
}

const getEvent = async (req, res) => {
    const {id} = req.params
    const event = await Event.findOne({_id : id})
    if (!event){
        throw new BadRequestError('something went wrong')
    }
    return res.status(200).json(event)
}

const updateEvent = async (req, res) => {
    const {id} = req.params;
    const {desc} = req.body;
    const {userID} = req.user;
    try {
        const event = await Event.findOneAndUpdate({_id: id, createdBy: userID}, {desc}, {new: true, runValidators: true});
        return res.status(200).json(event)
    } catch (error) {
       return res.status(400).json({msg: 'something went wrong'})
    }
}

const deleteEvent = async (req, res) => {
    const {id} = req.params;
    const {userID} = req.user;

    try {
        const event = await Event.findOneAndDelete({_id: id, createdBy: userID});
        return res.status(200).json(event)
    } catch (error) {
       return res.status(400).json({msg: 'something went wrong'})
    }
}



module.exports = {getEvents, getEvent, createEvent, updateEvent, deleteEvent}