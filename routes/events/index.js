const express = require('express')
const { getEvents, getEvent, updateEvent, deleteEvent, createEvent } = require('../../controllers/events')
const router = express.Router()
const authMiddleWare = require('../../middleware/auth')


router.route('/').get(authMiddleWare, getEvents).post(authMiddleWare, createEvent)
router.route('/:id').get(authMiddleWare, getEvent).patch(authMiddleWare, updateEvent).delete(authMiddleWare, deleteEvent)

module.exports = router