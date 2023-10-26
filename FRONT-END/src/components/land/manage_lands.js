import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Container, Row, Col, Form, FormControl, Button, Card } from 'react-bootstrap';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';




import '../land/manage_lands.css';
import Footer from '../footer/footer';


const ManageLand = () => {
    const { t, i18n } = useTranslation();
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

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };



    return (
        <div>
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
        <Container className='manageLands'>
            <Row className='mb-4'>
                <Col>
                    <h2>{t('managelands')}</h2>
                </Col>
            </Row>

            <Row className='mb-4'>
                <Col className='search'>
                    <Form inline>
                        <FormControl
                            type='text'
                            placeholder={t('searchland')}
                            className='mr-sm-2'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        
                    </Form>
                </Col>
                <Col className='text-right'>
                    <Button variant="primary" onClick={handleAddLotClick}>
                    {t('addnewland')}
                    </Button>
                </Col>
            </Row>

            <Row>
                {filteredData.map((item) => (
                    <Col key={item.id} md={4} sm={6} xs={12} className='mb-4'>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    {item.name}
                                    </Card.Title>
                                <Card.Text>
                                {t('city')}: {item.city}
                                </Card.Text>
                                
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        
        </Container>
        </div>
    );



};

export default ManageLand;
