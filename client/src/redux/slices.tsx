import { createSlice } from '@reduxjs/toolkit'

export const eventSlice = createSlice({
  name: 'event',

  initialState: {
    editEventID: null,
    events: [],
    allEvents: [],
    date: null
  },

  reducers: {
    addEditEventID: (state, action) => {
        state.editEventID = action.payload
    },

    removeEditEventID : state => {
      state.editEventID = null
    },

    addEvents: (state, action) => {
      state.events = action.payload
    },

    removeEvents: (state, action) => {
      if(!action.payload)return;
      if (action.payload.id === null)state.events = []
      else state.events = state.events.filter(item => {
        if (item['_id'] !== action.payload) return item;
      })
    },

    addDate: (state, action) => {
        state.date = action.payload
    },

    removeDate: (state) => {
      state.date = null
    },

    setAllEvents : (state, action) => {
      state.allEvents = action.payload
    }
  }
})

export const {addDate, addEditEventID, removeEditEventID, 
  addEvents, removeDate, setAllEvents, removeEvents
} = eventSlice.actions

export default eventSlice.reducer

export const selectEditEventID = (state:any) => state.event.editEventID
export const selectEvents = (state:any) => state.event.events
export const selectDate = (state:any) => state.event.date
export const selectAllEvents = (state:any) => state.event.allEvents