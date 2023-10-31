import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Footer from '../footer/footer';
import '../lot/manage_lot.css';
import Navbar from '../navBar/navbar';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Container, Row, Col, Form, FormControl, Card } from 'react-bootstrap';
import { alertService } from '../../_services/alert.service';
import { useTranslation } from 'react-i18next';




const ManageLot = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLandId, setSelectedLandId] = useState('1');
    const [selectedLanguage, setSelectedLanguage] = useState('sl');
    const history = useHistory();

    const { t, i18n } = useTranslation();




    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        console.log("Trying to change language to:", selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
        console.log("Language should be changed now.");
    }, [selectedLanguage]);
    


    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
        console.log("selected land on managelot: ", selectedLandId);

        submitSets(submitCollection.managelot, "/" + selectedLandId, true).then(res => {
            if (res && res.status) {
                setData(res.extra);
            }
        });
    }, [selectedLandId]);


    const redirectToInsertLot = () => {
        if (!selectedLandId) {
            alertService.error("Select Land");
        } else {
            history.push({
                pathname: '/insertlot',
                state: { landId: selectedLandId }
            });
        }
    };   

    return (
        <Container className='manageLots'>
            <Navbar
                selectedLandId={selectedLandId}
                onLandChange={setSelectedLandId}
                onLanguageChange={setSelectedLanguage}
            />
            <br />
            <Row className='mb-4'>
                <Col>
                    <h2>{t('managelots')}</h2>
                </Col>
            </Row>

            <Row className='mb-4'>
                <Col className='search'>
                    <Form inline>
                        <FormControl
                            type='text'
                            placeholder={t('search')}
                            className='mr-sm-2'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Form>
                </Col>
            </Row>

            <Row>
                {data.map((lot) => (
                    <Col key={lot.id} md={4} sm={6} xs={12} className='mb-4'>
                        <Card>
                            <Card.Body>
                                <Card.Title>{lot.name}</Card.Title>
                                <Card.Text>
                                {t('area')}: {lot.area} {lot.areaUOM}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row className='mt-4'>
                <Col>
                    <button className="btn btn-primary" onClick={redirectToInsertLot}>
                    {t('addlot')}
                    </button>
                </Col>
            </Row>

        </Container>
    );
};

export default ManageLot;
