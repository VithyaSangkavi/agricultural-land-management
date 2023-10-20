import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import '../land/insert_land.css';

const InsertLand = () => {
    const history = useHistory();

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

    return (
        <div className="AddLandCard">
            <Container className="container">
                <Row className="justify-content-center">
                    <Col sm={6}>
                        <Card className="card-container">
                            <Card.Header className="card-title">Add Land</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="name">
                                        <Form.Label className="form-label">Name</Form.Label>
                                        <Form.Control
                                            className="input-field"
                                            type="text"
                                            placeholder="Land Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="area">
                                        <Form.Label className="form-label">Area</Form.Label>
                                        <Form.Control
                                            className="input-field"
                                            type="text"
                                            placeholder="Land Area"
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
                                    <Form.Group controlId="city">
                                        <Form.Label className="form-label">City</Form.Label>
                                        <Form.Control
                                            className="input-field"
                                            as="select"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        >
                                            <option value="">Select City</option>
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
                                        ADD
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
