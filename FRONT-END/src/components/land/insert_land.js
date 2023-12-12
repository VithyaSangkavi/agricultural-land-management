import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MdArrowBackIos } from "react-icons/md";

import '../land/insert_land.css';
import Footer from '../footer/footer';

const InsertLand = () => {
    const history = useHistory();
    const { t, i18n } = useTranslation();


    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [areaUom, setAreaUom] = useState('');
    const [city, setCity] = useState('');

    const handleSubmit = () => {
        const dataToSend = {
            name,
            area,
            areaUom,
            city,
        };

        submitSets(submitCollection.saveland, dataToSend, false).then(res => {
            if (res && res.status) {

                alertService.success("Data sent successfully!")
                window.location.reload();

            } else {
                alertService.error("Data sent failed!")
            }
        })
    };

    const handleViewLandsClick = () => {
        history.push('/managelands');
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="add-land-screen">
            <div className="header-bar">
                <MdArrowBackIos className="back-button" />
                <p className="main-heading">{t('addland')}</p>
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

            <div className="content">
                <input
                    className="input-field"
                    type="text"
                    placeholder={t('name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="input-field"
                    type="text"
                    placeholder={t('landarea')}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                />

                <select
                    className="input-field"
                    as="select"
                    value={areaUom}
                    onChange={(e) => setAreaUom(e.target.value)}
                >
                    <option value="">{t('landarea')} UOM</option>
                    <option value="arce">{t('arce')}</option>
                    <option value="perch">{t('perch')}</option>
                </select>

                <select
                    className="input-field"
                    as="select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                >
                    <option value="">{t('city')} {t('select')}</option>
                    <option value="kandy">Kandy</option>
                    <option value="colombo">Colombo</option>
                    <option value="jaffna">Jaffna</option>
                    <option value="gampaha">Gampaha</option>
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

export default InsertLand;
