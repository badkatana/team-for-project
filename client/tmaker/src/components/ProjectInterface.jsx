import TextareaAutosize from 'react-textarea-autosize';
import './styles/ProjectInterface.css'
import { useState, useRef } from 'react';

function Project ({tags, popularTags, tagChoice, onNameChange, number, onDescrChange}) {
    const [tagsState, setTagsState] = useState(popularTags.map(tag => ({ id: tag.skill_id, name: tag.skill_name, checked: false })));
    const [searchActive, setSearch] = useState(false)
    const [filterTag, setFilterTag] = useState('');
    const btnRef = useRef()
    

    const searchResult = tags.filter(tag =>
        tag.skill_name.toLowerCase().includes(filterTag.toLowerCase())
    ).sort();

    const handleUserChoice = (tagName) => {
        if (!popularTags.filter(e => e.skill_id === tagName.skill_id).length > 0) {
            popularTags.push(tagName)
            console.log(tagChoice)
            tagChoice.push({id: tagName.skill_id, name: tagName.skill_name, checked: true})
            const updatedTagsState = popularTags.map(tag => {
                const existingTag = tagsState.find(t => t.name === tag.skill_name);
                    if (existingTag) {
                        return existingTag;
                    } else {
                        return { id: tag.skill_id, name: tag.skill_name, checked: true };
                    }
                });
            setTagsState(updatedTagsState);
        } 
    }

    const checkSkill = (tagSearch) => {
        setTagsState(tagsState.map(tag =>
            tag.name === tagSearch.name ? {id: tag.id, name: tagSearch.name, checked: !tag.checked} : tag
        ));

        if (tagChoice.filter(e => e.id === tagSearch.id).length > 0) {
            let y = tagChoice.findIndex(function (pet) {
                return pet === tagSearch.name})
            tagChoice.splice(y, 1)
        } else {
            tagChoice.push(tagSearch)
        }
    }

    return (
        <div className="blank">
            <div className="area-name">
            <input className="name-project" type='text' key={"input"} onChange={(e) => onNameChange(number, e.target.value)} placeholder="название проекта"></input>
                <TextareaAutosize minRows={2} maxRows={6} className='descript-project' onChange={(e) => onDescrChange(number, e.target.value)} placeholder="описание проекта" /> 
            </div>
            <div className="right project-int-r">
                
            <div className="skills " id='skills' >
            {tagsState.map((data) => (
                <div className="check">
                    <input type="checkbox" key={data.checked} checked={data.checked} 
                    onChange={() => {checkSkill(data)}}></input>
                    <div className="checkbox-tag" key={data.name}>{data.name}</div>
                </div>))}
            </div>

            <div className="tags-search" >
                <input type="search" className="search-bar" placeholder="поиск навыков"  value={filterTag} 
                onChange={(e) => {setFilterTag(e.target.value);}} 
                ref={btnRef}
                onClick={(e) => {setSearch(!searchActive);}}/>
                {searchActive && (<div className="tags-result">
                        {searchResult.map((res) => 
                        <div className='search-result-tag' 
                        onClick={(e) => {handleUserChoice(res); setSearch(!searchActive);}}
                            key={res.skill_id}>{res.skill_name}</div>)}
                        </div>)}
            </div>
            </div>
            
        </div>
    )
}

export default Project;