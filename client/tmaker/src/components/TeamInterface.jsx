import { useState, useEffect } from 'react';
import './styles/teamInterface.css'
import { getStudents } from '../http/funstions';


// /* { <div className='program'>{project['program'] + ", " + project['student_year'] + ", " + project['student_group']} </div>

function TeamInterface (project) {

    const [studentNames, setStudentNames] = useState([])
    const [gpa, setGPA] = useState(5)

    useEffect(() => {
        getStudents(project.team).then(data => {setStudentNames(data); 
            setGPA(getGPA(data));})
    }, [project])

    const getGPA = (data) => {
        const sum = data.reduce((partialSum, a) => partialSum + a.gpa, 0);
        return (sum/data.length).toFixed(2)
    }

    function countOccurrences(searchString) {
        let count = 0;
        
        studentNames.forEach(obj => {
            obj.skill.forEach(skill => {
                if (skill.includes(searchString)) {
                    count++;
                }
            });
        });
        
        return count;
    }

    return (
        <div className='container'>
            <div className='project-area left'>
                <div className='project-name'>{project.project_name}</div>
                <div className='desc'>{project['project_desc']}</div>
                <div className='skills-team'>{
                    project['project_skills'].map((data, index) => 
                            <div className='skill-team' key={index}>{data}{" "}{countOccurrences(data)}</div>)
                }</div> 
                <div className='desc'>Средний балл команды</div>
                <div className='desc'>{gpa}</div>
                </div>
            <div className='team-area right'>
                <div className='student-names'>{
                    studentNames.map((data, index) => 
                        <div className='student' key={index}>{data.name}</div>)
                }</div>
            </div>
        </div>
    )
}

export default TeamInterface; 