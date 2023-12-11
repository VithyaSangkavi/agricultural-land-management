import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import '../lot/insert_lot.css';
import Footer from '../footer/footer';
import Navbar from '../navBar/navbar';
import { submitCollection } from '../../_services/submit.service';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';



const InsertLot = ({ setSelectedLandId, selectedLandId }) => {
    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [areaUom, setAreaUom] = useState('');
    const [landNames, setLandNames] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const { t, i18n } = useTranslation();

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });
    }, [submitCollection.manageland]);

    const handleLandChange = (event) => {
        const newSelectedLandId = event.target.value;
        console.log(newSelectedLandId);
        setSelectedLandId(newSelectedLandId);
    };

    const handleSubmit = () => {

        console.log(selectedLandId);
        const dataToSend = {
            name,
            area,
            areaUom,
            landId: selectedLandId,
        };

        submitSets(submitCollection.savelot, dataToSend, false).then(res => {

            console.log(res)

            if (res && res.status) {
                alertService.success("Data sent successfully!")
                window.location.reload();
            } else {
                alertService.error("Error sending data");
            };
        });
    }

    return (
        <div className='inserlot-app-screen'>
            <p className='main-heading'>{t('addlots')}</p>
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
            </div>

            <div className="content">

                <input
                    className="input-field"
                    type="text"
                    placeholder={`${t('lot')} ${t('name')}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="input-field"
                    type="text"
                    placeholder={t('area')}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                />
                <select
                    className="input-field"
                    as="select"
                    value={areaUom}
                    onChange={(e) => setAreaUom(e.target.value)}
                >
                    <option value="">UOM {t('select')}</option>
                    <option value="arce">{t('arce')}</option>
                    <option value="perch">{t('perch')}</option>
                </select>

                <Button
                    className="add-button"
                    onClick={handleSubmit}
                >
                    {t('add')}
                </Button>



            </div>

            <div className='footer-alignment'>
                <Footer />
            </div>

        </div>
    );
};

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(InsertLot);
