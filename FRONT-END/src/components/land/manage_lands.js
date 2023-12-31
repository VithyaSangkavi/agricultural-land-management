import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Container, Row, Col, Form, FormControl, Button, Card } from 'react-bootstrap';
import { FaGlobeAmericas, FaLanguage, FaSearch, FaMapMarker } from 'react-icons/fa';
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
            <div className='main-heading'>

                <div className="outer-frame d-flex justify-content-between align-items-center">
                    <div className="filter-container d-flex align-items-center">
                        <MdArrowBackIos className="back-button" onClick={goBack} />
                    </div>

                    <div className="filter-container d-flex align-items-center">
                        <div className="land-filter">

                        </div>

                        <div className="language-filter">
                            <Dropdown onSelect={handleLanguageChange}>
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
                </div>


            </div>

            <div className="drop-down-container">

                <p className="home-heading">{t('managelands')}</p>

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
                        <h3>{item.name}</h3>
                        <p>{t('city')}: {item.city}</p>
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
