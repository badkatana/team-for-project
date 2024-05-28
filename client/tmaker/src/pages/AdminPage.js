import { useContext, useEffect, useState } from 'react';
import SiteName from '../components/SiteName';
import UserIcon from '../components/userIcon';
import './style/SettingsPage.css'
import { Context } from '..';
import StuTable from '../components/stuTable';
import StudentEdit from '../components/StudentEdit';
import { createStudent, getAllPrograms, getSkills, updateStudent, updateStudentSkills } from '../http/funstions';

// подправить задний фон при вызове студента

const AdminPage = () => {
    const {user, tags} = useContext(Context)
    const [selectedStudent, setStudent] = useState(
        {
            student_name: '', 
            student_surname : '', 
            student_patronym: '', 
            pseudo: '', 
            student_year: '', 
            student_group: '', 
            student_program: '', 
            gpa: '', 
            student_skills: []

        })
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        getSkills().then(data => tags.setTags(data))
        getAllPrograms().then(res => tags.setPrograms(res.data))
    }, [tags])

    const openStudentEdit = (student) => {
        setStudent(student)
        setModalOpen(!modalOpen)
    }

    const [createWindow, setCreate] = useState(false)

    const openStudentCreate = () => {
        setCreate(!createWindow)
    }

    const closeStudentEdit = (st_id, surname, name, patronym, 
        group, year, pseudo, skills, gpa, program_name) => {
        setModalOpen(!modalOpen)
        setStudent( {
            student_name: '', 
            student_surname : '', 
            student_patronym: '', 
            pseudo: '', 
            student_year: '', 
            student_group: '', 
            student_program: '', 
            gpa: '', 
            student_skills: []

        })
        console.log(st_id, gpa, surname, name, patronym, year, group, pseudo, program_name)
        updateStudent(st_id, gpa, surname, name, patronym, year, group, program_name, pseudo).then(data => console.log(data))
        const ski = skills.map(st => st.trim())
        updateStudentSkills(st_id, ski).then(data => console.log(data))
    }

    const closeNewStudentSave = (st_id, surname, name, patronym, 
        group, year, pseudo, skills, gpa, program_name) => {
        setCreate(!createWindow)
        setStudent( {
            student_name: '', 
            student_surname : '', 
            student_patronym: '', 
            pseudo: '', 
            student_year: '', 
            student_group: '', 
            student_program: '', 
            gpa: '', 
            student_skills: []
        })
        // surnae, student_name, patronym, group, year, program_name, skills, gpa, pseudom
        const ski = skills.map(st => st.trim())
        createStudent(surname, name, patronym, group, year, program_name, ski, gpa, pseudo).then(data => console.log(data))
    }

    const closeWithoutSave = () => {
        setModalOpen(!modalOpen)
        setStudent( {
            student_id: '',
            student_name: '', 
            student_surname : '', 
            student_patronym: '', 
            pseudo: '', 
            student_year: '', 
            student_group: '', 
            student_program: '', 
            gpa: '', 
            student_skills: []
        })
    }

    const closeWithoutSaveNew = () => {
        setCreate(!createWindow)
        setStudent( {
            student_id: '',
            student_name: '', 
            student_surname : '', 
            student_patronym: '', 
            pseudo: '', 
            student_year: '', 
            student_group: '', 
            student_program: '', 
            gpa: '', 
            student_skills: []
        })
    }
    
    return (
        <div className="back-fon">
            <UserIcon email={user.getEmail()}/>
             <SiteName/>

             {modalOpen && (<StudentEdit student={selectedStudent} tags={tags.tags.slice()} programs={tags.programs.slice()} setOpenModal={closeStudentEdit} close={closeWithoutSave}/>)} 

             {createWindow && (<StudentEdit student={selectedStudent} tags={tags.tags.slice()} programs={tags.programs.slice()} setOpenModal={closeNewStudentSave} close={closeWithoutSave}/>)} 
             <div className='button save' onClick={(e) => openStudentCreate()}>Добавить студента</div>
             <StuTable openModal={openStudentEdit}/>
             
        </div>
    )
}

export default AdminPage;