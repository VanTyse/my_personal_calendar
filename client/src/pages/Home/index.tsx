import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css'


const Home = () => {
    const navigate = useNavigate()
    const isLoggedIn = document.cookie.split('; ').some((item) => item.startsWith('token='))
    
    return(
        <div className='home'>{
            !isLoggedIn ?
            <div>
                <p>Hi...</p>
                <h1>This is a personal calendar</h1>
                <h2> mini-app created by Vantyse</h2>
                <h3>It seems like you aren't logged in.</h3>
                <button onClick={() => navigate('/login')}>Login Now</button>
            </div>
            :
            <div>
                <p>Hi...</p>
                <h1>This is a personal calendar</h1>
                <h2> mini-app created by Vantyse</h2>
                <h3>You are already logged in</h3>
                <button onClick={() => navigate('/calendar')}>Go to Calendar</button>
            </div>
        }
        </div>
    )
}

export default Home;