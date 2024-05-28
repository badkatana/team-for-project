import {React, useEffect, useState, useRef} from 'react'
import './styles/StuTable.css'
import { IoClose } from "react-icons/io5";

// фамилия, имя, отчество, группа, год, average_score - просто инпут 
// навыки, направление -- комбобокс 

function StudentEdit({student, setOpenModal, tags, programs, close}) {
    const [skillsDef, setSkillsDef] = useState(student.student_skills)
    const [nameEdit, setNameEdit] =  useState(student.student_name == null ? '' : student.student_name)
    const [surnameEdit, setSurname] =  useState(student.student_surname == null ? '' : student.student_surname)
    const [patronymEdit, setPatronym] =  useState(student.student_patronym == null ? '' : student.student_patronym)
    const [groupEdit, setGroup] =  useState(student.student_group == null ? '' : student.student_group)
    const [yearAdd, setYear] = useState(student.student_year == null ? '' : student.student_year)
    const [pseudoEdit, setPseudo] = useState(student.pseudo == null ? '' : student.pseudo)
    const [gpaEdit, setGPA] = useState(student.gpa = null ? '' : student.gpa)
    const [selected, setSelected] = useState(student.student_program === null ? '' : student.student_program)

    const deleteSkill = (tag) => {
        const updatedSkills = skillsDef.filter(skill => skill !== tag);
        setSkillsDef(updatedSkills);
    }

    const addSkill = (tag) => {
        if (!skillsDef.filter(e => e.trim() === tag.skill_name).length > 0) {
            setSkillsDef([...skillsDef, tag.skill_name])
        }
    }

    const [isActive, setIsActive] = useState(false)

    const handleClick = () => {

    }
    const [searchActive, setSearch] = useState(false)
    const [filterTag, setFilterTag] = useState('');
    const btnRef = useRef()

    const searchResult = tags.filter(tag =>
        tag.skill_name.toLowerCase().includes(filterTag.toLowerCase())
    ).sort();


    // useEffect(() => {
    //     console.log(skillsDef)
    // }, [])

    return (
        <div className='modal-background'>
        <div className='modal-st-window'>

            <div className='edit-name'>
                <div className='edit-value'>Фамилия</div>
                <input className='right' placeholder='Иванов' value={surnameEdit} onChange={(e) => setSurname(e.target.value)}></input>
            </div>

            <div className='edit-name'>
                <div className='edit-value'>Имя</div>
                <input  className='right' placeholder='Иван' value={nameEdit} onChange={(e) => setNameEdit(e.target.value)}></input>
            </div>

            <div className='edit-name'>
                <div className='edit-value'>Отчество</div>
                <input className='right' placeholder='Иванович' value={patronymEdit} onChange={(e) => setPatronym(e.target.value)}></input>
            </div>

            <div className='edit-name'>
                <div className='edit-value'>Псевдоним</div>
                <input className='right' placeholder='Starshine' value={pseudoEdit} onChange={(e) => setPseudo(e.target.value)}></input>
            </div>

            <div className='edit-name'>
                <div className='edit-value'>Год поступления</div>
                <input className='right' placeholder='2077-01-09' value={yearAdd} onChange={(e) => setYear(e.target.value)}></input>
            </div>

            <div className='edit-name'>
                <div className='edit-value'>Группа</div>
                <input className='right' placeholder='1' value={groupEdit} onChange={(e) => setGroup(e.target.value)}></input>
            </div>

            <div className='edit-name'>
                <div className='edit-value'>GPA</div>
                <input  className='right' placeholder='4.77' value={gpaEdit} onChange={(e) => {setGPA(e.target.value); console.log(gpaEdit)}}></input>
            </div>

            <div className='edit-name'>
                <div className='edit-value'>Направление</div>
                <div className='combobox-edit right'>
                    <div className="combo-btn-edit" onClick={(e) => setIsActive(!isActive)}>{selected}</div>

                    {isActive && (
                        <div className="combo-content-edit">
                        {programs.map((data) => (
                        <div className="combo-item-edit" key={data} onClick={(e) => { setSelected(data); setIsActive(!isActive); }}>{data}</div>))}
                </div>
            )}
        </div>
            </div>

            <div className='edit-name'>
                <div>Навыки студента</div>
                <div className='right'>
                    <div className='skill-row'>
                        {skillsDef.map((element) => (
                            <div className='skill-item'>
                            <div className='skill'>{element}</div>
                            <IoClose onClick={(e) => deleteSkill(element)}/>
                            </div>
                        ))}
                    </div>
                    <div className="tags-search" >
                        <input type="search" className="search-bar" placeholder="поиск навыков"  value={filterTag} 
                            onChange={(e) => {setFilterTag(e.target.value);}} 
                            ref={btnRef}
                            onClick={(e) => {setSearch(!searchActive);}}/>
                            {searchActive && (<div className="tags-result">
                        {searchResult.map((res) => 
                        <div className='search-result-tag' 
                        onClick={(e) => {addSkill(res); setSearch(!searchActive);}}
                            key={res.skill_id}>{res.skill_name}</div>)}
                        </div>)}
                    </div>
                </div>
            </div>

            <div className='button'>
            <div className='button save' onClick={(e) => 
                setOpenModal(student.student_id, 
                    surnameEdit, nameEdit, patronymEdit, 
                    groupEdit, yearAdd, pseudoEdit, skillsDef, gpaEdit,selected
                )}>Сохранить</div>
            
            <div className='button close' onClick={(e) => close()}>Закрыть</div>

            </div>
        </div>
        </div>
    )
}

export default StudentEdit