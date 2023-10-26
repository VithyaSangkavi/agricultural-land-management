import React, { useState, useEffect } from 'react';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Form, Row, Col } from 'react-bootstrap';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import '../navBar/navbar.css'



function Navbar({ selectedLandId, onLandChange, onLanguageChange, }) {
    const [landNames, setLandNames] = useState([]);

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });
    }, []);

    const handleLandChange = (event) => {
        onLandChange(event.target.value);

    };

    const handleLanguageChange = (languageKey) => {
        onLanguageChange(languageKey);
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
                        <DropdownButton
                            id="dropdown-language"
                            title={<FaLanguage />}
                            onSelect={handleLanguageChange}
                        >
                            <Dropdown.Item eventKey="en">
                                <FaGlobeAmericas /> English
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="sl">
                                <FaGlobeAmericas /> Sinhala
                            </Dropdown.Item>
                        </DropdownButton>
                    </Form.Group>
                </Col>
            </Row>
        </nav>
    )
}

export default Navbar
