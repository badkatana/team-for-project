import SiteName from '../components/SiteName';
import UserIcon from '../components/userIcon';
import TeamInterface from '../components/TeamInterface'
import './style/SettingsPage.css'
import './style/teamsPage.css'
import { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import { getProjects } from '../http/funstions';


// фильтр переписать 

const TeamsPage = observer(() => {
    const {project, user} = useContext(Context);
    const [search, SetSearch] = useState('')

    useEffect(() => {
        getProjects(user._id).then(data => project.setProject(data))
    }, [])

    return (
        <div className="back-fon">
            <UserIcon email={user.getEmail()}/>
            <SiteName/>

            <div className='white-area'>
                <div className='info-area'>
                    <div className='txt-projects'>Подобранные команды и проекты</div>
                    <input className='search-bar-projects' placeholder='поиск по названию проекта' onChange={(e) => SetSearch(e.target.value)}></input>
                </div>
                
                <div className='teams-array'>
                    <div className='scroll'>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    {project.getProjects().filter(item => item.team != null && item.project_name.toLowerCase().includes(search.toLowerCase())).map((data, index) => 
                        <TeamInterface key={index} {...data}/>
                    )}</div>
                    </div>
                </div>
            </div>

             
        </div>
    )
})

export default TeamsPage;