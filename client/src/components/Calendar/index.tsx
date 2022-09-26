import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import './index.css'
import { addDate, setAllEvents, selectAllEvents } from "../../redux/slices";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import DayModal from '../DayModal';
import useInViewPort from '../../custom_hooks/useInViewPort'

export const Calendar = ({startDate, endDate}: {startDate:Date, endDate:Date}) => {
    const navigate = useNavigate()
    const isLoggedIn = document.cookie.split('; ').some((item) => item.startsWith('token='))

    useEffect(() => {
        if (isLoggedIn) return
        navigate('/login')
    }, [])


    const date = Date.parse(startDate.toString());
    const dispatch = useDispatch();
    const [done, setDone] = useState<boolean>(false)
    const getAllEvents = async () => {
        let localEvents;
        const x = localStorage.getItem('refresh-events');
        const lastRefresh:number|null = x ? +x : null
        const todaysDate = new Date(Date.now()).getDate();
        
        if (lastRefresh && todaysDate - lastRefresh >= 1){
            try {
                const {data} = await axios('/api/v1/event');
                setDone(true);
                localStorage.setItem('calendar-events', JSON.stringify(data));
                dispatch(setAllEvents(data))   
            } catch (error:any) {
                setDone(true);
                console.log(error.response);
            }
        }
        else{
            const localEventsStringified = localStorage.getItem('calendar-events');        
            if (localEventsStringified) {
                localEvents = JSON.parse(localEventsStringified)            
            }
            if (localEvents){
                dispatch(setAllEvents(localEvents)) 
                setDone(true)
            }
            else{
                try {
                    const {data} = await axios('/api/v1/event');
                    setDone(true);
                    localStorage.setItem('calendar-events', JSON.stringify(data));
                    localStorage.setItem('refesh-events', `${todaysDate}`)
                    dispatch(setAllEvents(data))   
                } catch (error:any) {
                    setDone(true);
                    console.log(error.response);
                }
            }
        }
    }

    useEffect(() => {
        getAllEvents()
    }, [])

    return(
        <>{
            done && 
            <div>
                <div className="calendar">
                    <div className="years">
                        <Year date={date} endDate={endDate}/>
                    </div>
                </div>
                <DayModal/>
            </div>
        }
        </>
    )
}

const Year = ({date, endDate}:{date: number, endDate:Date}) => {
    const currentYear = new Date(date).getFullYear();
    const nextYearDate = new Date(`${currentYear+1}-01-01`);
    const nextYearDateMilliseconds = Date.parse(nextYearDate.toString())
    const endDateMilliseconds = Date.parse(endDate.toString())
    const inViewPort = useInViewPort()

    const ref = useCallback((element:any) => {
        if (!element)return
        inViewPort({current: element})
    }, [])

    
    if (date > endDateMilliseconds) return null
    return (
        <>        
        <div className="year" ref={ref}>
            <h1>{currentYear}</h1>
            <div className="months">
                <Month date={date}  endDate={endDate}/>
            </div>
        </div>
        <Year date={nextYearDateMilliseconds}  endDate={endDate}/>
        </>
    )
}



const Month = ({date, endDate}:{date: number, endDate:Date}) => {
    const currentDate = new Date(date)
    const currentYear = currentDate.getFullYear();
    const currentMonth = new Date(date).getMonth();
    const nextMonthDate = (currentMonth < 11) ? new Date(`${currentYear}-${currentMonth+2}-01`) : new Date(0)
    const nextMonthDateMilliseconds = Date.parse(nextMonthDate.toString())   
    
    const inViewPort = useInViewPort()

    const ref = useCallback((element:any) => {
        if (!element)return
        inViewPort({current: element})
    }, [])

    if (currentMonth > 11 || currentYear === 1970) return null
    return(
        <>
        <div ref={ref} className="month">
            <h2>{months[currentMonth]}</h2>
            <div className="days">
                <div className="day-of-week">Sun</div>
                <div className="day-of-week">Mon</div>
                <div className="day-of-week">Tue</div>
                <div className="day-of-week">Wed</div>
                <div className="day-of-week">Thurs</div>
                <div className="day-of-week">Fri</div>
                <div className="day-of-week">Sat</div>
                <Day date={date} endDate={endDate} count={0} month={currentMonth} year={currentYear}/>
            </div>
        </div>
        <Month date={nextMonthDateMilliseconds}  endDate={endDate}/>
        </>
    )
}

const Day = ({date, endDate, count, month, year}:{date: number, endDate:Date, count:number, month:number, year:number}) => {
    const currentDate = new Date(date)
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    const currentDayOfWeek =  currentDate.getDay();
    const currentDay = currentDate.getDate()
    const newCount = (count === 6) ? 0 : count+1
    const dispatch = useDispatch();
    const events =  useSelector(selectAllEvents)    
    const dateHasEvent = events.find((item:any) => item.date == date)

    const inViewPort = useInViewPort()

    const ref = useCallback((element:any) => {
        if (!element)return
        inViewPort({current: element})
    }, [])

    const handleDayClick = async () => {
        dispatch(addDate(date))
    }
    

    if(currentMonth > month || currentYear > year) return null
    if(currentDayOfWeek !== count) {
        return(
            <>
                <div className="empty-day"></div>
                <Day date={date}  endDate={endDate} count={count+1}  month={currentMonth} year={currentYear}/>
            </>
        )
    }
    return(
        <>
        <div ref={ref} className={`day ${dateHasEvent && "has-event fade-in"}`} onClick={handleDayClick}>
            {currentDay}
        </div>
        <Day date={date + 86400000}  endDate={endDate} count={newCount}  month={currentMonth} year={currentYear}/>
        </>
    )
}

const months = ['january', 'february', 'march', 'april', 'may', 
'june', 'july', 'august', 'september', 'october', 'november', 'december']