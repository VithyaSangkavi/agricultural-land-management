import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../lot/manage_lot.css';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Container, Row, Col, Form, FormControl, Card } from 'react-bootstrap';
import { alertService } from '../../_services/alert.service';



const ManageLot = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLandId, setSelectedLandId] = useState('');
    const [landNames, setLandNames] = useState([]);
    const history = useHistory();


    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });
    }, [data]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleLandChange = (event) => {
        const newSelectedLandId = event.target.value;
        setSelectedLandId(newSelectedLandId);
    };


    useEffect(() => {
        console.log("selected land : ", selectedLandId);

        submitSets(submitCollection.managelot, "/"+selectedLandId, true).then(res => {
            if (res && res.status) {
                setData(res.extra);
            } else {
                alertService.error("No Lots");
            };
        });

      /*   if (selectedLandId) {
            axios.get(`http://localhost:8080/service/master/lotFindByLandId/${selectedLandId}`).then((res) => {
                setData(res.data.extra);
                console.log(res.data.extra);
            });
        } else {
            setData([]);
        } */
    }, [selectedLandId]);

    const redirectToInsertLot = () => {
        history.push({
            pathname: '/insertlot',
            state: { landId: selectedLandId }
        });
    };


    return (
        <Container className='manageLots'>
            <Row className='mb-4'>
                <Col>
                    <h2>Manage Lots</h2>
                </Col>
            </Row>

            <Row className='mb-4'>
                <Col md={6}>
                    <Form inline>
                        <FormControl
                            type='text'
                            placeholder='Search Lots'
                            className='mr-sm-2'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Form>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Filter by Land:</Form.Label>
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
            </Row>

            <Row>
                {data.map((lot) => (
                    <Col key={lot.id} md={4} sm={6} xs={12} className='mb-4'>
                        <Card>
                            <Card.Body>
                                <Card.Title>{lot.name}</Card.Title>
                                <Card.Text>
                                    Area: {lot.area} {lot.areaUOM}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row className='mt-4'>
                <Col>
                    <button className="btn btn-primary" onClick={redirectToInsertLot}>
                        Add New Lot
                    </button>
                </Col>
            </Row>
        </Container>
    );
};

export default ManageLot;
