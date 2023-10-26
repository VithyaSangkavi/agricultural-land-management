import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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
        <div className="AddLandCard">
            <div className="position-absolute top-0 end-0 mt-2 me-2">
                <DropdownButton
                    id="dropdown-language"
                    title={<FaLanguage />}
                    onSelect={handleLanguageChange}
                    variant="secondary"
                >
                    <Dropdown.Item eventKey="en">
                        <FaGlobeAmericas /> English
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="sl">
                        <FaGlobeAmericas /> Sinhala
                    </Dropdown.Item>
                </DropdownButton>
            </div>
            <Container className="container">
                <Row className="justify-content-center">
                    <Col sm={6}>
                        <Card className="card-container">
                            <Card.Header className="card-title">{t('addland')}</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="name">
                                        <Form.Label className="form-label">{t('name')}</Form.Label>
                                        <Form.Control
                                            className="input-field"
                                            type="text"
                                            placeholder="Land Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="area">
                                        <Form.Label className="form-label">{t('landarea')}</Form.Label>
                                        <Form.Control
                                            className="input-field"
                                            type="text"
                                            placeholder="Land Area"
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="areaUom">
                                        <Form.Label className="form-label">{t('landarea')} UOM</Form.Label>
                                        <Form.Control
                                            className="input-field"
                                            as="select"
                                            value={areaUom}
                                            onChange={(e) => setAreaUom(e.target.value)}
                                        >
                                            <option value="">UOM {t('select')}</option>
                                            <option value="arce">{t('arce')}</option>
                                            <option value="perch">{t('perch')}</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="city">
                                        <Form.Label className="form-label">{t('city')}</Form.Label>
                                        <Form.Control
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
                        </Card>
                    </Col>
                </Row>
            </Container>

        </div>
    );
};

export default InsertLand;
