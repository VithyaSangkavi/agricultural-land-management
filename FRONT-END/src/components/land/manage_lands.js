import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Container, Row, Col, Form, FormControl } from 'react-bootstrap';


import '../land/manage_lands.css';


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
        history.push('/insertLot');
    };


    return (
        <Container className='manageLands'>
            <Row>
                <Col className='search'>
                    <Form>
                        <FormControl
                            type='text'
                            placeholder='Search'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Form>
                </Col>
            </Row>

            <Row>
                {filteredData.map((item) => (
                    <Col key={item.id} md={4} sm={6} xs={12} className='divWithBorder'>
                        <p>{item.name}</p>
                        <p>{item.city}</p>
                    </Col>
                ))}
            </Row>
        </Container>
    );



};

export default ManageLand;
