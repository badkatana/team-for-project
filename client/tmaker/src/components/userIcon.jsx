import { useContext, useState } from 'react'
import './styles/userEmail.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { Context } from '..'

function UserIcon({ email }) {

    const navigate = useNavigate()
    const {user} = useContext(Context)

    const logOut = () => {
        user.setAuth(false)
        user.setID(0)
        user.setEmail("")
        localStorage.removeItem('token')
        navigate('/')
    }

    const [options, setOptions] = useState(false)

    return (
        <div className='icon-menu'>

            <div className="user-email" onClick={(e) => setOptions(!options)}>{email}</div>
            <div>
                {options && (
                <div className="icon-content">
                    <div className='icon-item'><NavLink to={'/settings'} style={{ textDecoration: 'none', color: '#333' }}>Проекты</NavLink></div>
                    <div className='icon-item'><NavLink to={'/teams'} style={{ textDecoration: 'none', color: '#333' }}>Мои команды</NavLink></div>
                    {user.getRole() === 'admin' && (
                        <div className='icon-item'><NavLink to={'/admin'} style={{ textDecoration: 'none', color: '#333' }}>Админ-панель</NavLink></div>
                    )
                    }
                    <div className='icon-item' onClick={(e) => logOut()}>Выйти</div>
                </div>
                )}
            </div>
        </div>
    )
}

export default UserIcon