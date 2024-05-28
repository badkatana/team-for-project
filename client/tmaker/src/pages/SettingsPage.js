import SiteName from '../components/SiteName';
import UserIcon from '../components/userIcon';
import Combobox from './../components/Combobox';
import './style/SettingsPage.css';
import { useContext, useState } from 'react';
import { getAllPrograms, getGroups, getYears } from '../http/funstions';
import { Context } from '..';
import ProjectsPage from './ProjectsPage';


const SettingsPage = () => {
    const [selected, SetSelected] = useState("Выберите")
    const [selected1, SetSelected1] = useState("Выберите")
    const [selected2, SetSelected2] = useState("Выберите")
    
    const [etap, setEtap] = useState(true)
    const {user} = useContext(Context)

    const handleClick = () => {

        if (selected === "Выберите" || selected1 === "Выберите" || selected2 === "Выберите") { 
            alert('Заполните все поля')
        } else {
            user.setProgram(selected)
            user.setYear(selected1)
            user.setGroup(selected2)
            console.log(user)
            setEtap(false)
        }
    }

    return (
       etap ? (<div className='back-fon'>
            <UserIcon email={user.getEmail()}/>
            <SiteName />

            <div className='etap1'>Этап 1: подбор интересующей группы студентов</div>

            <div className='blank-page'>
                <div className='Instuct'>Заполните поля</div>

                <div className='row-set'>
                    <div className='row-name'>Направление обучения</div>
                    <div className='right'><Combobox getData={getAllPrograms()} selected={selected} setSelected={SetSelected}/></div>
                </div>

                <div className='row-set'>
                    <div className='row-name'>Год поступления</div>
                    <div className='right'><Combobox getData={getYears()} selected={selected1} setSelected={SetSelected1}/></div> 
                </div>

                <div className='row-set'>
                    <div className='row-name'>Учебная группа</div>
                    <div className='right'><Combobox getData={getGroups()} selected={selected2} setSelected={SetSelected2}/></div>
                </div>

                <div className='projects-create row-name' onClick={(e) => handleClick()}>Перейти к созданию проектов</div>
            </div>
        </div> ) 
        : (<ProjectsPage/>)
    )
}

export default SettingsPage;