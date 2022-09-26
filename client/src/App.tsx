import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import {Calendar} from './components/Calendar'
import {RegisterPage, LoginPage} from './pages/authentication'
import Home from './pages/Home'

function App() { 
  
  return (
    <Router>
      <Routes>
        <Route path='/calendar' element={<Calendar startDate={new Date('2022-01-01')} endDate={new Date('2024-12-31')}/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </Router>
  )
}

export default App