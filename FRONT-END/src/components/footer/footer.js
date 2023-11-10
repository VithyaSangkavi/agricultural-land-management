import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faChartPie } from '@fortawesome/free-solid-svg-icons';
import './footer.css'
import { useHistory } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar';

const Footer = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const history = useHistory();

    const toggleSideNav = () => {
        setIsSideNavOpen(!isSideNavOpen);
        history.push('/sideNavPage')
    };

    const clickHome = () => {
        history.push('/home')
    }
    
    const clickReport = () => {
        history.push('/report')
    }

    return (
        <div className='app-screen'>
            <div className='footer-app-screen'>
                <div className="footer-container">

                    <div className="footer-icon">
                        <FontAwesomeIcon icon={faBars} size="2x" onClick={toggleSideNav} />
                    </div>
                    <div className="footer-icon">
                        <FontAwesomeIcon icon={faHome} size="2x" onClick={clickHome} />
                    </div>
                    <div className="footer-icon">
                        <FontAwesomeIcon icon={faChartPie} size="2x" onClick={clickReport}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
