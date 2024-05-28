import Carousel from 'react-bootstrap/Carousel';
import SiteName from '../components/SiteName';
import './style/SettingsPage.css'
import { useState } from 'react';
import img1 from './../assets/image.png'
import teams from './../assets/teams.png'
import {useNavigate} from 'react-router-dom'


const StartPage = () => {

    const [index, setIndex] = useState(0);
    const nav = useNavigate()
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const navToLogin = () => {
        nav('/registration')
    }
    return (
        <div className="back-fon">
             <SiteName/>

            <div className='description-team'>
                Данный проект был выполнен командой студентов UTMN. Его основной функционал - подбор под IT-проект 
                команды студентов с необходимыми навыками. 
                <br></br>Исполнители: Ершов А, Киселева А, Дронов И, Елясов С.
                <br></br> 
                <div>

                </div>
            </div>
                <center style={{fontFamily: "sans-serif", color: "white"}}>Создавайте команды такими, какими вы хотите их видеть!</center>


            <div className='st' style={{width: "600px"}}>

            {/* <Carousel activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item interval={300}>
                    <img width={600} height={300} src={teams} alt='' />
                </Carousel.Item>
                <Carousel.Item interval={300}>
                    <img width={600} height={300} src={img1} alt=''/>
                </Carousel.Item>
                <Carousel.Item interval={300}>
                    <img width={600} height={300} src={img1} alt=''/>
                </Carousel.Item>
            </Carousel> */}
            </div>
             <div className='button-reg' onClick={(e) => navToLogin()}>
                войти или зарегестрироваться
                </div>
        </div>
    )
}

export default StartPage;