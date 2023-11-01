import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormControl, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';

import Footer from '../footer/footer';
import '../Income/manage_income.css';


function ManageIncome() {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLandId, setSelectedLandId] = useState('1');
    const [landNames, setLandNames] = useState([]);


    const { i18n, t } = useTranslation();
    const history = useHistory();


    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const handleLandChange = (event) => {
        const newSelectedLandId = event.target.value;
        setSelectedLandId(newSelectedLandId);
    };

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });
    }, [submitCollection.manageland]);

    useEffect(() => {
        if (selectedLandId) {
            axios.get(`http://localhost:8080/service/master/incomeFindByLandId/${selectedLandId}`)
                .then((res) => {
                    setData(res.data.extra);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setData([]);
                });
        } else {
            setData([]);
        }
    }, [selectedLandId]);


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const redirectToInsertIncome = () => {
        history.push({
            pathname: '/insertincome',
            state: { landId: selectedLandId }
        });
    };

    return (
        <div className='manageincome-app-screen'>
            <p className='main-heading'>{t('manageincome')}</p>
            <div className="position-absolute top-0 end-0 mt-2 me-2">
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

            <div className='drop-down-container'>
                <Dropdown className='custom-dropdown'>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Control as="select" value={selectedLandId} onChange={handleLandChange}>
                                <option value="">All Lands</option>
                                {landNames.map((land) => (
                                    <option key={land.id} value={land.id}>
                                        {land.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>

                </Dropdown>
                <br />
                <button className="add-income-button" onClick={redirectToInsertIncome}>
                    {t('addincome')}
                </button>
            </div>

            <div>
                <input
                    className='search-field'
                    type="text"
                    placeholder={t('search')}
                    value={searchQuery}
                // onChange={handleSearchChange}
                />
            </div>

            <div className='income-list'>
                {data.map((income) => (
                    <div key={income.id} className="income-card">
                        <Link to={`/updateIncome/${income.id}`} className='custom-link'>

                            <h3>{income.month}</h3>
                            <p>
                                {t('price')}: {income.price}
                            </p>
                        </Link>
                    </div>
                ))}
            </div>

            <div>
                <br />
                <br />
                <br />
            </div>

            <div className='footer-alignment'>
                <Footer />
            </div>



        </div>
    );
}

export default ManageIncome;
