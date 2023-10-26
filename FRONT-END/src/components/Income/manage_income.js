import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import '../Income/manage_income.css';
import Footer from '../footer/footer';
import Navbar from '../navBar/navbar';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Container, Row, Col, Form, FormControl, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


function ManageIncome() {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [landNames, setLandNames] = useState([]);
    const [selectedLandId, setSelectedLandId] = useState('1');
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const { t, i18n } = useTranslation();

    const history = useHistory();

    useEffect(() => {
        console.log("Trying to change language to:", selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
        console.log("Language should be changed now.");
    }, [selectedLanguage]);


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };



    useEffect(() => {
        console.log("selected land : ", selectedLandId);

        if (selectedLandId) {
            axios.get(`http://localhost:8080/service/master/incomeFindByLandId/${selectedLandId}`).then((res) => {
                setData(res.data.extra);
                console.log(res.data.extra);
            });
        } else {
            setData([]);
        }
    }, [selectedLandId]);

    const redirectToInsertIncome = () => {
        history.push({
            pathname: '/insertincome',
            state: { landId: selectedLandId }
        });
    };


    return (
        <div className='manageincome'>
            <div className='incomenavbar'>
                <Navbar
                    selectedLandId={selectedLandId}
                    onLandChange={setSelectedLandId}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                />
            </div>
            <div className='AddIncome'>
                <Container className='manageLots'>
                    <Row className='mb-4'>
                        <Col>
                            <h2>{t('manageincome')}</h2>
                        </Col>
                    </Row>

                    <Row className='mb-4'>
                        <Col md={6}>
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
                        {data.map((income) => (
                            <Col key={income.id} md={4} sm={6} xs={12} className='mb-4'>
                                <Link to={`/updateIncome/${income.id}`} className="custom-link">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{income.month}</Card.Title>
                                            <Card.Text>
                                            {t('price')}: {income.price}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                    <Row className='mt-4'>
                        <Col>
                            <button className="btn btn-primary" onClick={redirectToInsertIncome}>
                            {t('addincome')}
                            </button>
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>

    );
}

export default ManageIncome
