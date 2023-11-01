import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import '../Income/insert_income.css';
import Footer from '../footer/footer';
import Navbar from '../navBar/navbar';
import { submitCollection } from '../../_services/submit.service';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { useTranslation } from 'react-i18next';

const InsertIncome = () => {

    const [month, setMonth] = useState('');
    const [price, setValue] = useState('');
    const [selectedLandId, setSelectedLandId] = useState('1');
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const { t, i18n } = useTranslation();


    useEffect(() => {
        console.log("Trying to change language to:", selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
        console.log("Language should be changed now.");
    }, [selectedLanguage]);

    const handleSubmit = () => {
        const dataToSend = {
            month,
            price,
            landId: selectedLandId,
        };

        console.log(dataToSend);

        submitSets(submitCollection.saveincome, dataToSend, false).then(res => {
            if (res && res.status) {
                alertService.success("Data sent successfully!")
            } else {
                alertService.error("Error sending data");
            };
        });
    }

    return (
        <div className='insertincome'>
            <div className='incomenavbar'>
                <Navbar
                    selectedLandId={selectedLandId}
                    onLandChange={setSelectedLandId}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                />
            </div>
            <br />
            <div className="AddLandCard">
                <Container className="container">
                    <Row className="justify-content-center">
                        <Col sm={6}>
                            <Card className="card-container">
                                <Card.Header className="card-title">{t('addincome')}</Card.Header>
                                <Card.Body>
                                    <Form>
                                        <Form.Group controlId="month">
                                            <Form.Label className="form-label" >{t('month')}</Form.Label>
                                            <Form.Control
                                                className="input-field"
                                                as="Select"
                                                placeholder=""
                                                value={month}
                                                onChange={(e) => setMonth(e.target.value)}
                                            >
                                                <option value="">{t('select')}</option>
                                                <option value="January">January</option>
                                                <option value="February">February</option>
                                                <option value="March">March</option>
                                                <option value="April">April</option>
                                                <option value="May">May</option>
                                                <option value="June">June</option>
                                                <option value="July">July</option>
                                                <option value="Auguest">Auguest</option>
                                                <option value="September">September</option>
                                                <option value="October">October</option>
                                                <option value="November">November</option>
                                                <option value="December">December</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="value">
                                            <Form.Label className="form-label">{t('price')}</Form.Label>
                                            <Form.Control
                                                className="input-field"
                                                type="text"
                                                placeholder={t('price')}
                                                value={price}
                                                onChange={(e) => setValue(e.target.value)}
                                            />
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
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>
        </div>
    );
};

export default InsertIncome;
