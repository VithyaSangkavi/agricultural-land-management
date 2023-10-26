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



const InsertLot = () => {
    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [areaUom, setAreaUom] = useState('');
    const [selectedLandId, setSelectedLandId] = useState('1');
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const { t, i18n } = useTranslation();

    useEffect(() => {
        console.log("Trying to change language to:", selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
        console.log("Language should be changed now.");
    }, [selectedLanguage]);

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
            } else {
                alertService.error("Error sending data");
            };
        });
    }

    return (
        <div className='inserlot'>
            <div className='lotnavbar'>
             <Navbar
                selectedLandId={selectedLandId}
                onLandChange={setSelectedLandId}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
            />
            </div>
            <div className="AddLandCard">
                <Container className="container">
                    <Row className="justify-content-center">
                        <Col sm={6}>
                            <Card className="card-container">
                                <Card.Header className="card-title">{t('addlots')}</Card.Header>
                                <Card.Body>
                                    <Form>
                                        <Form.Group controlId="name">
                                            <Form.Label className="form-label">{t('name')}</Form.Label>
                                            <Form.Control
                                                className="input-field"
                                                type="text"
                                                placeholder={`${t('lot')} ${t('name')}`}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="area">
                                            <Form.Label className="form-label">{t('area')}</Form.Label>
                                            <Form.Control
                                                className="input-field"
                                                type="text"
                                                placeholder={t('area')}
                                                value={area}
                                                onChange={(e) => setArea(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="areaUom">
                                            <Form.Label className="form-label">{t('area')} UOM</Form.Label>
                                            <Form.Control
                                                className="input-field"
                                                as="select"
                                                value={areaUom}
                                                onChange={(e) => setAreaUom(e.target.value)}
                                            >
                                                <option value="">{t('select')}</option>
                                                <option value="arce">{t('arce')}</option>
                                                <option value="perch">{t('perch')}</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Button
                                            className="submit-button"
                                            variant="primary"
                                            onClick={handleSubmit}
                                        >
                                            {t('add')}
                                        </Button>
                                    </Form>
                                </Card.Body>
                                <br/>
                            </Card>
                        </Col>
                    </Row>
                    
                </Container>
            </div>
        </div>
    );
};

export default InsertLot;
