import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faChartPie } from '@fortawesome/free-solid-svg-icons';
import './footer.css'
import { useHistory, useLocation } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';


const Footer = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [activePage, setActivePage] = useState('');
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        setActivePage(location.pathname);
    }, [location]);

    const toggleSideNav = () => {
        setIsSideNavOpen(!isSideNavOpen);
        history.push('/sideNavPage')
    };

    const clickHome = () => {
        history.push('/home')
    }

    const clickReport = () => {
        history.push('/report')
        axios.post('http://localhost:8081/service/master/work-assigned-saveWorkDates')
            .then((response) => {
                console.log('successfull', response);
            })
    }

    const getIconColor = (iconName) => {
        return activePage === `/${iconName}` ? 'active-icon' : 'inactive-icon';
    };

    return (
        <div className='app-screen'>
            <div className='footer-app-screen'>
                <div className="footer-container">

                    <div className={`footer-icon ${getIconColor('sideNavPage')}`}>
                        <FontAwesomeIcon icon={faBars} size="2x" onClick={toggleSideNav} />
                    </div>
                    <div className={`footer-icon ${getIconColor('home')}`}>
                        <FontAwesomeIcon icon={faHome} size="2x" onClick={clickHome} />
                    </div>
                    <div className={`footer-icon ${getIconColor('report')}`}>
                        <FontAwesomeIcon icon={faChartPie} size="2x" onClick={clickReport} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
