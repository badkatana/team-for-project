import { useContext, useState } from 'react';
import SiteName from '../components/SiteName';
import UserIcon from '../components/userIcon';
import './style/SettingsPage.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { login, registration } from '../http/funstions';
import {jwtDecode} from 'jwt-decode'
import { observer } from 'mobx-react-lite';
import { Context } from '..';


const AuthPage = observer(() => {
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [error, setError] = useState('')
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname === '/login'
    const {user} = useContext(Context)

    const tokenInfo = (token) => {
        const userInfo = jwtDecode(token)
        user.setAuth(true) 
        user.setID(userInfo.id)
        user.setEmail(userInfo.email)
        user.setRole(userInfo.role)
    }

    const click = async() => {
        if (isLogin) {
            await login(email, pwd).then(data => {
                if (data.msg != null) {
                    setError(data.msg)
                } 
                if (data.token != null) {
                    tokenInfo(data.token)
                    navigate('/teams')
                }
                
            })
        } else {
            await registration(email, pwd).then(data => {
                if (data.msg != null) {
                    setError(data.msg)
                } 
                if (data.token != null) {
                    tokenInfo(data.token)
                    navigate('/teams')
                }
            })
        }
    }

    return (
        <div className="back-fon">
             <SiteName/>

             <div className='form-auth'>
                <div className='auth-text'>{isLogin ? "Авторизация" : "Регистрация"}</div>
                <input className='auth-input' key={"email"} type='email' placeholder='email' onChange={(e) => setEmail(e.target.value)}></input>
                <input className='auth-input' key={"pwd"} type='password' placeholder='password' onChange={(e) => setPwd(e.target.value)}></input>

                <div className='submit-button' onClick={(e) => click()}>{isLogin ? "Войти в аккаунт" : "Создать аккаунт"}</div>
                {!isLogin ? <NavLink to={'/login'} style={{ textDecoration: 'none' }}><div className='choose-way'>есть аккаунт?</div></NavLink>
                : <NavLink to={'/registration'} style={{ textDecoration: 'none' }}><div className='choose-way'>нет аккаунта?</div></NavLink>}
                <div>{error}</div>
             </div>
        </div>
    )
})

export default AuthPage;