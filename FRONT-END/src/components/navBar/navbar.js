import React, { useState, useEffect } from 'react';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Form, Row, Col } from 'react-bootstrap';
import '../navBar/navbar.css'



function Navbar({ selectedLandId, onLandChange, selectedLanguage, onLanguageChange }) {
    const [landNames, setLandNames] = useState([]);

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });
    },[]);

    const handleLandChange = (event) => {
        onLandChange(event.target.value);

    };

    const handleLanguageChange = (event) => {
        onLanguageChange(event.target.value);

    };

    return (
        <nav>
            <Row>
                <Col xs={6}>
                    <Form.Group className="mb-0">
                        <Form.Label>Land:</Form.Label>
                        <Form.Control as="select" value={selectedLandId} onChange={handleLandChange} className="custom-select">
                            <option value="">Select Lands</option>
                            {landNames.map((land) => (
                                <option key={land.id} value={land.id}>
                                    {land.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col xs={6}>
                    <Form.Group className="mb-0">
                        <Form.Label>Language:</Form.Label>
                        <Form.Control as="select" value={selectedLanguage} onChange={handleLanguageChange} className="custom-select">
                            <option value="english">English</option>
                            <option value="sinhala">Sinhala</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
        </nav>
    )
}

export default Navbar
