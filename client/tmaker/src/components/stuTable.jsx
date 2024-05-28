import {React, useState, useEffect} from 'react'
import './styles/StuTable.css'
import { FiEdit3 } from "react-icons/fi";
import { getAllStudents } from '../http/funstions';
import StudentEdit from './StudentEdit';

function StuTable({openModal}) {
    const [students, setStudents] = useState([])
    useEffect(() => {
        getAllStudents().then(data => setStudents(data))
    }, [])

    return (
        <div className='fon'>
            <table className='table'>
            <tbody>

    <tr className='table-header'>
        <th>№</th>
        <th>Фамилия</th>
        <th>Имя</th>
        <th>Отчество</th>
        <th>Псевдоним</th>
        <th>Год поступления</th>
        <th>Группа</th>
        <th>Направление</th>
        <th>GPA</th>
        <th>Навыки</th>
        <th>Изменить</th>
    </tr>
    </tbody>
    
    <tbody className='table-body'>
    {students.map((element, index) => (
        <tr className='table-row' key={index+1}>
            <td>{index + 1}</td>
            <td>{element.student_surname}</td>
            <td>{element.student_name}</td>
            <td>{element.student_patronym}</td>
            <td>{element.pseudo}</td>
            <td>{element.student_year}</td>
            <td>{element.student_group}</td>
            <td>{element.student_program}</td>
            <td>{element.gpa}</td>
            <td className='table-skills'>{element.student_skills}</td>
            <td><FiEdit3 onClick={(e) => {openModal(element)}}/></td>
    </tr>
    ))}
    </tbody>
 </table>
             
        </div>
            
    )
}

export default StuTable