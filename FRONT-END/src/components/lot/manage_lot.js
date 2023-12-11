import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Footer from '../footer/footer';
import '../lot/manage_lot.css';
import Navbar from '../navBar/navbar';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Container, Row, Col, Form, FormControl, Card } from 'react-bootstrap';
import { alertService } from '../../_services/alert.service';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas, FaLanguage, FaSearch } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';




const ManageLot = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLandId, setSelectedLandId] = useState('1');
    const [landNames, setLandNames] = useState([]);
    const history = useHistory();
    const { t, i18n } = useTranslation();

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
            submitSets(submitCollection.managelot, "/" + selectedLandId, true).then(res => {
                if (res && res.status) {
                    setData(res.extra);
                }
            });
        }
    }, [selectedLandId, submitCollection.managelot]);

    const redirectToInsertLot = () => {
        if (!selectedLandId) {
            alertService.error("Select Land");
        } else {
            history.push({
                pathname: '/insertlot',
                state: { landId: selectedLandId }
            });
        }
    };





    return (
        <div className='managelot-app-screen'>
            <p className='main-heading'>{t('managelots')}</p>
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
                <button className="add-worker-button" onClick={redirectToInsertLot}>
                    {t('addlot')}
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

            <div className='lot-list'>
                {data.map((lot) => (
                    <div key={lot.id} className="lot-card">
                        <h3>{t('name')}: {lot.name}</h3>
                        <p>{t('area')}: {lot.area} {lot.areaUOM}</p>
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
};

export default ManageLot;
