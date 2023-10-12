import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faChartPie } from '@fortawesome/free-solid-svg-icons';
import './footer.css'
import {useHistory} from 'react-router-dom'

const Footer = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const history = useHistory();

    const toggleSideNav = () => {
        setIsSideNavOpen(!isSideNavOpen);
        history.push('/sideNavBar')
    };

    return (
        <div className='footer-app-screen'>
            <div className="footer-container">
                <div className="footer-icon">
                    <FontAwesomeIcon icon={faBars} size="2x" onClick={toggleSideNav} />
                </div>
                <div className="footer-icon">
                    <FontAwesomeIcon icon={faHome} size="2x" />
                </div>
                <div className="footer-icon">
                    <FontAwesomeIcon icon={faChartPie} size="2x" />
                </div>
            </div>
        </div>
    );
};

export default Footer;
