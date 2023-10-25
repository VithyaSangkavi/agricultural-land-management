import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Container, Row, Col, Form, FormControl, Button, Card } from 'react-bootstrap';


import '../land/manage_lands.css';
import Footer from '../footer/footer';


const ManageLand = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const history = useHistory();


    useEffect(() => {

        submitSets(submitCollection.manageland, false).then(res => {

            console.log(res.extra);

            if (res && res.status) {
                setData(res.extra);
                console.log("Fetched successfully!");
            } else {
                console.log("Fetch failed!");
            }
        });

    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = data.filter((item) => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleAddLotClick = () => {
        history.push('/insertland');
    };


    return (
        <div>
        <Container className='manageLands'>
            <Row className='mb-4'>
                <Col>
                    <h2>Manage Lands</h2>
                </Col>
            </Row>

            <Row className='mb-4'>
                <Col className='search'>
                    <Form inline>
                        <FormControl
                            type='text'
                            placeholder='Search Lands'
                            className='mr-sm-2'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        
                    </Form>
                </Col>
                <Col className='text-right'>
                    <Button variant="primary" onClick={handleAddLotClick}>
                        Add New Lot
                    </Button>
                </Col>
            </Row>

            <Row>
                {filteredData.map((item) => (
                    <Col key={item.id} md={4} sm={6} xs={12} className='mb-4'>
                        <Card>
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    City: {item.city}
                                </Card.Text>
                                
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className='footer-alignment'>
                <Footer />
            </div>
        </Container>
        </div>
    );



};

export default ManageLand;
