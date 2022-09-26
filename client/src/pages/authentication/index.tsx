import './index.css'
import { FormEvent, useState, useEffect } from "react"
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { Message } from '../../components/DayModal'


interface PasswordInputInterface {
    type:string,
    setType: () => void,
    password:string, 
    setPassword: (password:string)=>void
}

const PasswordInput = ({type, setType, password, setPassword}:PasswordInputInterface) => {
    return (
        <div className="password-input">
            <input type={type} id='password' minLength={6} value={password} 
            onChange={e => setPassword(e.target.value)} placeholder='enter password' required/>
            {password.length > 0 && <span onClick={setType} className='show-pass-btn'>{type==='text' ? 'HIDE' : 'SHOW'}</span>}
        </div>
    )
}
    

export const RegisterPage = () => {
    const navigate = useNavigate()
    const [messageSettings, setMessageSettings] = useState<{type: 'success' | 'warning' | null, value: string, show:boolean}>({type: null, value: '', show: false})
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordInputType, setPasswordInputType] = useState<string>('password')

    
    useEffect(() => {
        if (messageSettings.value === '') return;
        const timeout = setTimeout(() => {
            setMessageSettings({type: null, value: '', show: false})
        }, 2000)

        return () => clearTimeout(timeout)
    }, [messageSettings.value])

    const handleRegistration = async (e:FormEvent) => {
        e.preventDefault()
        if (!name || !email || !password) return console.log('fill all fields')
        try {
            const {data} = await axios.post('/api/v1/auth/register', {name, email, password})
            console.log(data);
            setMessageSettings({value:'Registration Successful', type:'success', show:true})
            const timeout = setTimeout(() => navigate('/calendar') , 4000)
        } catch (error) {
            console.log(error);
            setMessageSettings({value:'Something went wrong. Please try again.', type:'success', show:true})
        }
    }
    return (
        <div className="auth-container">
            <div className="register">
            {messageSettings.show && <Message value={messageSettings.value} type={messageSettings.type}/>}
                <h1>Register</h1>
                <form className="register-form" onSubmit={handleRegistration}>
                    <div className="input-group">
                        <label htmlFor="name">Name: </label> 
                        <input type="text" id="name" placeholder="enter name" 
                        value={name} onChange={e => setName(e.target.value)} required/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email: </label> 
                        <input type="email" id="email" placeholder="enter email" 
                        value={email} onChange={e => setEmail(e.target.value)} required/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password: </label> 
                        <PasswordInput type={passwordInputType} setType={() => setPasswordInputType((currentType) => {
                            if (currentType === 'password')return 'text'
                            else return 'password'
                        })}
                        password={password} setPassword={setPassword} />
                    </div>
                    <div className="buttons">
                        <button type='submit'>Submit</button>
                        <button onClick={() => navigate('/login')} type='button'>Go to Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export const LoginPage = () => {
    const navigate = useNavigate()
    const [messageSettings, setMessageSettings] = useState<{type: 'success' | 'warning' | null, value: string, show:boolean}>({type: null, value: '', show: false})
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordInputType, setPasswordInputType] = useState<string>('password')

    
    useEffect(() => {
        if (messageSettings.value === '') return;
        const timeout = setTimeout(() => {
            setMessageSettings({type: null, value: '', show: false})
        }, 2000)

        return () => clearTimeout(timeout)
    }, [messageSettings.value])

    const handleLogin = async (e:FormEvent) => {
        e.preventDefault()
        if (!email || !password) return console.log('fill all fields')
        try {
            const {data} = await axios.post('/api/v1/auth/login', {email, password})
            setMessageSettings({value:'Login Successful', type:'success', show:true})
            const timeout = setTimeout(() => navigate('/calendar') , 4000)
        } catch (error) {
            console.log(error);
            setMessageSettings({value:'Something went wrong. Please try again.', type:'success', show:true})
        }
    }
    return (
        <div className="auth-container">
            <div className="login">
                {messageSettings.show && <Message value={messageSettings.value} type={messageSettings.type}/>}
                <h1>Login</h1>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email: </label> 
                        <input type="email" id="email" placeholder="enter email" 
                        value={email} onChange={e => setEmail(e.target.value)} required/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password: </label> 
                        <PasswordInput type={passwordInputType} setType={() => setPasswordInputType((currentType) => {
                            if (currentType === 'password')return 'text'
                            else return 'password'
                        })}
                        password={password} setPassword={setPassword} />
                    </div>
                    <div className="buttons">
                        <button type='submit'>Submit</button>
                        <button onClick={() => navigate('/register')} type='button'>Go to Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

