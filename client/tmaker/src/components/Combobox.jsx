import './styles/Combobox.css'
import { useState, useRef, useEffect } from 'react'


function Combobox({ getData, selected, setSelected }) {
    const [isActive, setIsActive] = useState(false)
    const handleClick = () => {
        setIsActive(!isActive);
    };

    const [data, setData] = useState([])

    const btnRef = useRef() // close a combo-content if a click if detected 

    useEffect(() => {
        const closeDropdown = e => {
            if (!btnRef.current.contains(e.target)) 
            {
                setIsActive(false);
            }
        }
        document.body.addEventListener('click', closeDropdown)
        return () => document.body.removeEventListener('click', closeDropdown)
    }, [])

    useEffect(() => {
        getData.then(res => setData(res.data))
    })

    return (
        <div className='combobox'>
            <div ref={btnRef} className="combo-btn" onClick={handleClick}>{selected}</div>

            {isActive && (
                <div className="combo-content">
                    {data.map((data) => (
                        <div className="combo-item" key={data} onClick={(e) => { setSelected(data); setIsActive(false); }}>{data}</div>))}
                </div>
            )}
        </div>
    )
}

export default Combobox