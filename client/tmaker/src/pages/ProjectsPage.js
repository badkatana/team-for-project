import SiteName from './../components/SiteName'
import './style/SettingsPage.css';
import ProjectInterface from './../components/ProjectInterface'
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSkills, getTopSkills, createProject, getTeams } from '../http/funstions';
import { observer } from 'mobx-react-lite';
import UserIcon from '../components/userIcon';
import { Context } from '..';


const ProjectsPage = observer(() => {

    const [components, setComponents] = useState([]);
    const [projectNames, setProjectNames] = useState([]);
    const [descr, setDescr] = useState([])

    const handleProjectNameChange = (index, newName) => {
        projectNames[index] = newName;
        setProjectNames(projectNames);
    };

    const handleProjectDescrChange = (index, newDescr) => {
        descr[index] = newDescr;
        setDescr(descr);
    };

    const {tags, user} = useContext(Context)

    const addComponent = () => {
        setComponents([...components, <ProjectInterface key={components.length} tags={tags.tags.slice()} onNameChange={handleProjectNameChange} onDescrChange={handleProjectDescrChange} number={components.length} popularTags={tags.popularTags.slice()} tagChoice={[]}/>]);
    };

    useEffect(() => {
        getTopSkills().then(data => tags.setPopularTags(data))
        getSkills().then(data => tags.setTags(data))
        console.log(user)
    }, [tags])

    const [id, setID] = useState([]);
    const navigate = useNavigate()

    const handleResult = async() => {
        if (components.length === 1 || components.length < 2) {
            alert("Минимальное кол-во проектов = 2")
        } else {
            const newIds = [];
            for (let i = 0; i < components.length; i++) {
                const tags = components[i].props.tagChoice.map(tag => tag.id);
                const data = await createProject(projectNames[i], descr[i], user._id, tags);
                newIds.push(data);
                setID(newIds);
            }
            await getTeams(newIds, user.getYear(), 1, user.getGroup());
            navigate('/teams')
        }
    }

    return (
        <div className='back-fon' style={{paddingBottom: 10 + 'em'}} >
            <UserIcon email={user.getEmail()}/>
            <SiteName/>
            <div className='etap1'>Этап 2: создание студенческих проектов. <br></br> После нажатия кнопки "Завершить" проекты появятся во вкладке "Мои команды" в течение 30 секунд <br></br>Минимум 2 навыка для одного проекта</div>
            <div className='buttons'>
                <div className='projects-more' onClick={(e) => addComponent()}>Добавить проект</div>
                <div className='result-project project-more' onClick={handleResult}>Завершить</div>
            </div>
            {components}
        </div>
    )
})

export default ProjectsPage;