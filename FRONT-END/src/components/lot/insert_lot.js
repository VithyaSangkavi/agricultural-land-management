import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import '../lot/insert_lot.css';
import Footer from '../footer/footer';
import { submitCollection } from '../../_services/submit.service';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';

const InsertLot = () => {

    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [areaUom, setAreaUom] = useState('');

    const location = useLocation();
    const landId = location.state?.landId;  // Grab landId from state data
    console.log(landId);

    const handleSubmit = () => {
        const dataToSend = {
            name,
            area,
            areaUom,
            landId: landId,
        };

        submitSets(submitCollection.savelot, dataToSend, false).then(res => {
            if (res && res.status) {
                alertService.success("Data sent successfully!")
            } else {
                alertService.error("Error sending data");
            };
        });
    }

    return (
        <div className="AddLandCard">
            <Container className="container">
                <Row className="justify-content-center">
                    <Col sm={6}>
                        <Card className="card-container">
                            <Card.Header className="card-title">Add Lot</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="name">
                                        <Form.Label className="form-label">Name</Form.Label>
                                        <Form.Control
                                            className="input-field"
                                            type="text"
                                            placeholder="Lot Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="area">
                                        <Form.Label className="form-label">Area</Form.Label>
                                        <Form.Control
                                            className="input-field"
                                            type="text"
                                            placeholder="Lot Area"
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="areaUom">
                                        <Form.Label className="form-label">Area UOM</Form.Label>
                                        <Form.Control
                                            className="input-field"
                                            as="select"
                                            value={areaUom}
                                            onChange={(e) => setAreaUom(e.target.value)}
                                        >
                                            <option value="">Select Area UOM</option>
                                            <option value="arce">Arce</option>
                                            <option value="perch">Perch</option>
                                        </Form.Control>
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
                <div>
                    <Footer />
                </div>
            </Container>
        </div>
    );
};

export default InsertLot;
