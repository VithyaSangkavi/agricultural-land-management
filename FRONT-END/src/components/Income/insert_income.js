import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import '../lot/insert_lot.css';
import Footer from '../footer/footer';
import Navbar from '../navBar/navbar';
import { submitCollection } from '../../_services/submit.service';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';

const InsertIncome = () => {

    const [month, setMonth] = useState('');
    const [price, setValue] = useState('');
    const [selectedLandId, setSelectedLandId] = useState('1');
    const [selectedLanguage, setSelectedLanguage] = useState('english');


    const location = useLocation();
    const landId = location.state?.landId;  // Grab landId from state data
    console.log(landId);

    const handleSubmit = () => {
        const dataToSend = {
            month,
            price,
            landId: landId,
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
        <div>
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
                                <Card.Header className="card-title">Add Income</Card.Header>
                                <Card.Body>
                                    <Form>
                                        <Form.Group controlId="month">
                                            <Form.Label className="form-label">Month</Form.Label>
                                            <Form.Control
                                                className="input-field"
                                                as="Select"
                                                placeholder="Lot Name"
                                                value={month}
                                                onChange={(e) => setMonth(e.target.value)}
                                            >
                                                <option value="">Select Month</option>
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
                                            <Form.Label className="form-label">Value</Form.Label>
                                            <Form.Control
                                                className="input-field"
                                                type="text"
                                                placeholder="Value"
                                                value={price}
                                                onChange={(e) => setValue(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Button
                                            className="submit-button"
                                            variant="primary"
                                            onClick={handleSubmit}
                                        >
                                            ADD
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
