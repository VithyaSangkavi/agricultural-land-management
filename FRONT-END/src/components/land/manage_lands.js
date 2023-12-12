import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Container, Row, Col, Form, FormControl, Button, Card } from 'react-bootstrap';
import { FaGlobeAmericas, FaLanguage, FaSearch } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MdArrowBackIos } from "react-icons/md";
import '../land/manage_lands.css';
import Footer from '../footer/footer';

const ManageLand = () => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const history = useHistory();

    useEffect(() => {

        submitSets(submitCollection.manageland, false).then(res => {

            console.log(res.extra);

            if (res && res.status) {
                setData(res.extra);
                console.log("Fetched successfully!");
            } else {
                console.log("Fetch failed!");
            }
        });

    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = data.filter((item) => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleAddLotClick = () => {
        history.push('/insertland');
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className='manageland-app-screen'>
            <div className="header-bar">
                <MdArrowBackIos className="back-button" onClick={goBack}/>
                <p className="main-heading">{t('managelands')}</p>
                <div className="position-absolute top-0 end-0 me-2">
                    <Dropdown alignRight onSelect={handleLanguageChange}>
                        <Dropdown.Toggle variant="secondary" style={{ background: 'none', border: 'none' }}>
                            <FaGlobeAmericas style={{ color: 'white' }} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="en">English</Dropdown.Item>
                            <Dropdown.Item eventKey="sl">Sinhala</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            <div className="drop-down-container">
                <button className='add-land-button' onClick={handleAddLotClick}>
                    {t('addnewland')}
                </button>
            </div>

            <div className="search-container">
                <div className="search-wrapper">
                    <input
                        className='search-field'
                        type="text"
                        placeholder={t('search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="search-icon">
                        <FaSearch />
                    </div>
                </div>
            </div>

            <div className='land-list'>
                {filteredData.map((item) => (
                    <div key={item.id} className="land-card">
                        <Card.Body>
                            <h3>{item.name}</h3>
                            <p>{t('city')}: {item.city}</p>
                        </Card.Body>
                    </div>
                ))}
            </div>
            <div>
                <br />
                <br />
            </div>

            <br />
            <div className='footer-alignment'>
                <Footer />
            </div>

        </div>
    );


};

export default ManageLand;
