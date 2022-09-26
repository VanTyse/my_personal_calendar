import { FormEvent, SetStateAction, useEffect, useState } from 'react'
import './index.css'
import axios from 'axios'
import { selectEvents, removeEditEventID, setAllEvents, removeDate, selectDate, selectEditEventID, addEvents, removeEvents, addEditEventID } from "../../redux/slices";
import { useDispatch, useSelector } from 'react-redux';

const DayModal = () => {
    const date = useSelector(selectDate);
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [messageSettings, setMessageSettings] = useState<{type: 'success' | 'warning' | null, value: string, show:boolean}>({type: null, value: '', show: false})

    const editID = useSelector(selectEditEventID)
    

    useEffect(() => {
        if (date) {
            setShowModal(true)
        }
        if (date == null){
            setShowModal(false)
        }
    }, [date])

    useEffect(() => {
        if (messageSettings.value === '') return;
        const timeout = setTimeout(() => {
            setMessageSettings({type: null, value: '', show: false})
        }, 4000)

        return () => clearTimeout(timeout)
    }, [messageSettings.value])

    const formattedDate = date ? new Date(date).toDateString() : null
    return (
        <div className={`day-modal ${showModal && 'scale-up'}`}>
            {messageSettings.show && <Message value={messageSettings.value} type={messageSettings.type}/>}
            <h1>Today's Events</h1>
            <div className="date"><em>{formattedDate}</em></div>
            <Events setIsEditing={setIsEditing} />
            {!isEditing ? <AddEvent setShowModal={setShowModal} setMessage={setMessageSettings}/> : 
            <EditEvent setIsEditing={setIsEditing} id={editID} setMessage={setMessageSettings}/>}
        </div>    
    )
}


const Events = ({setIsEditing}:{setIsEditing: (x:boolean) => void}) => {
    const dispatch = useDispatch()
    const date = useSelector(selectDate);
    const events = useSelector(selectEvents);

    const getEvents = async (date:number) => {
        let localEvents
        const localEventsStringified = localStorage.getItem('calendar-events') || '';
                
        if (localEventsStringified) {
            localEvents = JSON.parse(localEventsStringified)            
        }
        if (localEvents){
            const events = localEvents.filter((item:any) => {
                if (item.date === date){
                    return item
                }
            })
            dispatch(addEvents(events))
        }
        else{
            try {
                const {data}:any = await axios(`/api/v1/event/?date=${date}`);
                dispatch(addEvents(data))
            } catch (error:any) {
                console.log(error.response);  
            }
        }
    }

    useEffect(() => {
        date && getEvents(date)
    }, [date])

    useEffect(() => {
        console.log(events);
    }, [events])

    return(
        <ul className="events">
            {events.length > 0 ?
                events.map((event:{_id:string, desc:string }) => {
                    const {_id, desc} = event
                    return <Event setIsEditing={setIsEditing} desc={desc} key={_id} id={_id}/>
                })
                :
                <div>No events yet. Add a new event</div>
            }
        </ul>
    )
}

const Event = ({desc, setIsEditing, id}:{desc:string, setIsEditing: (x:boolean) => void, id:string}) => {
    const dispatch = useDispatch()
    const date = useSelector(selectDate);
    const handleSetEditing = () => {
        setIsEditing(true)
        dispatch(addEditEventID(id))      
    }
    const getEvents = async (date:number) => {
        let localEvents
        const localEventsStringified = localStorage.getItem('calendar-events') || '';
                
        if (localEventsStringified) {
            localEvents = JSON.parse(localEventsStringified)            
        }
        if (localEvents){
            const events = localEvents.filter((item:any) => {
                if (item.date === date){
                    return item
                }
            })
            dispatch(addEvents(events))
        }
        else{
            try {
                const {data}:any = await axios(`/api/v1/event/?date=${date}`);
                dispatch(addEvents(data))
            } catch (error:any) {
                console.log(error.response);  
            }
        }
    }

    const handleDelete = async () => {
        try {
            const {data} = await axios.delete(`/api/v1/event/${id}`)
            console.log(data);
            const allLocalEventsStringified = localStorage.getItem('calendar-events') || '[]';
            const allLocalEvents = JSON.parse(allLocalEventsStringified);
            const newLocalEvents = allLocalEvents.filter((item:any) => {
                if (item._id !== id)return item
            })
            localStorage.setItem('calendar-events', JSON.stringify(newLocalEvents))
            dispatch(setAllEvents(newLocalEvents))
            getEvents(date)       
        } catch (error:any) {
            console.log(error.response);
            
        }
    }

    return (
        <li className="event">
            <div className="left">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                </svg>
                <h3>{desc}</h3>
            </div>
            <div className="right">
                <div className="edit-icon" onClick={handleSetEditing}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg>
                </div>
                <div className="delete-icon" onClick={handleDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-x" viewBox="0 0 16 16">
                        <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"/>
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                </div>
            </div>
        </li>
    )
}


interface AddInterface {
    setShowModal: (x:boolean) => void, 
    setMessage: React.Dispatch<SetStateAction<{type: 'success' | 'warning' | null, value: string, show: boolean;}>>
}

const AddEvent = ({setShowModal, setMessage}:AddInterface) => {
    const [newEvent, setNewEvent] = useState<string>('')
    const date = useSelector(selectDate);
    const dispatch = useDispatch()

    const getEvents = async (date:number) => {
        let localEvents
        const localEventsStringified = localStorage.getItem('calendar-events') || '';
                
        if (localEventsStringified) {
            localEvents = JSON.parse(localEventsStringified)            
        }
        if (localEvents){
            const events = localEvents.filter((item:any) => {
                if (item.date === date){
                    return item
                }
            })
            dispatch(addEvents(events))
        }
        else{
            try {
                const {data}:any = await axios(`/api/v1/event/?date=${date}`);
                dispatch(addEvents(data))
            } catch (error:any) {
                console.log(error.response);  
            }
        }
    }

    const handleAddEvent = async (e:FormEvent) => {
        e.preventDefault();
       try {
        const {data} = await axios.post('/api/v1/event', {
            date,
            desc: newEvent
        })
        const allLocalEventsStringified = localStorage.getItem('calendar-events') || '[]';
        const allLocalEvents = JSON.parse(allLocalEventsStringified);
        allLocalEvents.push(data)        
        localStorage.setItem('calendar-events', JSON.stringify(allLocalEvents))
        dispatch(setAllEvents(allLocalEvents))
        getEvents(date);
        setMessage({value:`Operation Success`, type:'success', show:true})
        setNewEvent('')
       } catch (error:any) {
        if (!(document.cookie.split(';').some((item) => item.trim().startsWith('token=')))) 
            return setMessage({value:`Please login to perform this operation`, type:'warning', show:true})
        if (error.response.status == 401) 
            return setMessage({value:`Unauthorized to perform this operation`, type:'warning', show:true})
        else return setMessage({value:`Something went wrong`, type:'warning', show:true})
       }
    }

    const handleCancel = () => {
        setShowModal(false)
        dispatch(removeDate())
        dispatch(removeEvents(null))
    }

    return(
        <form onSubmit={handleAddEvent} className='add-event-form'>
            <input type="text" placeholder='Enter new event' value={newEvent} onChange={e => setNewEvent(e.target.value)}/>
            <div className="buttons">
                <button type='button' id='cancel-btn' onClick={handleCancel}>Cancel</button>
                <button type='submit' id='add-btn'>Add</button>
            </div>
        </form>
    )
}

interface EditInterface {
    setIsEditing:(X:boolean) => void, 
    id:string,
    setMessage: React.Dispatch<SetStateAction<{type: 'success' | 'warning' | null, value: string, show: boolean}>>
}

const EditEvent = ({setIsEditing, id, setMessage}:EditInterface) => {
    const events = useSelector(selectEvents);
    const date = useSelector(selectDate);
    const {desc} = events.find((item:any) => item._id === id)
    const [editEvent, setEditEvent] = useState<string>(desc)
    const dispatch = useDispatch()

    const getEvents = async (date:number) => {
        let localEvents
        const localEventsStringified = localStorage.getItem('calendar-events') || '';
                
        if (localEventsStringified) {
            localEvents = JSON.parse(localEventsStringified)            
        }
        if (localEvents){
            const events = localEvents.filter((item:any) => {
                if (item.date === date){
                    return item
                }
            })
            dispatch(addEvents(events))
        }
        else{
            try {
                const {data}:any = await axios(`/api/v1/event/?date=${date}`);
                dispatch(addEvents(data))
            } catch (error:any) {
                console.log(error.response);  
            }
        }
    }


    const handleEditEvent = async (e:FormEvent) => {
        e.preventDefault();
        try {
            const {data} = await axios.patch(`/api/v1/event/${id}`, {
                desc: editEvent
            })
            const allLocalEventsStringified = localStorage.getItem('calendar-events') || '[]';
            const allLocalEvents = JSON.parse(allLocalEventsStringified);
            const newLocalEvents = allLocalEvents.map((item:any) => {
                if (item._id === id){
                    item.desc = editEvent
                }
                return item
            })
            localStorage.setItem('calendar-events', JSON.stringify(newLocalEvents))
            dispatch(setAllEvents(newLocalEvents))
            allLocalEvents.push(data)
            getEvents(date)
            setMessage({value:`Operation Success`, type:'success', show:true})
            setEditEvent('')
            setIsEditing(false)
        }
        catch (error:any) {
            if (!(document.cookie.split(';').some((item) => item.trim().startsWith('token=')))) 
            return setMessage({value:`Please login to perform this operation`, type:'warning', show:true})
        if (error.response.status == 401) 
            return setMessage({value:`Unauthorized to perform this operation`, type:'warning', show:true})
        
        }
    }

    useEffect(() => {
        setMessage({type: 'success', value:'Editing Mode On!', show:true})
    }, [])

    const handleCancel = () => {
        dispatch(removeEditEventID())
        setIsEditing(false)
    }

    return(
        <form onSubmit={handleEditEvent} className='add-event-form'>
            <input type="text" placeholder='edit event' value={editEvent} onChange={e => setEditEvent(e.target.value)}/>
            <div className="buttons">
                <button type='button' id='cancel-btn' onClick={handleCancel}>Cancel</button>
                <button type='submit' id='add-btn'>Edit</button>
            </div>
        </form>
    )
}

export const Message = ({value, type}: {value:string, type:'success'|'warning'|null}) => {
    return (
        <div style={{
            color: type === 'success' ? 'hsl(120, 40%, 40%)' : 'hsl(0, 80%, 50%)',
            backgroundColor: type === 'success' ? 'hsl(120, 90%, 90%)' : 'hsl(0, 90%, 90%)',
            }} className="message">
            {value}
        </div>
    )
}

export default DayModal;