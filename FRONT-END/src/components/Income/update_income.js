import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import '../Income/update_income.css';
import Footer from '../footer/footer';
import Navbar from '../navBar/navbar';
import { submitCollection } from '../../_services/submit.service';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';

const UpdateIncome = () => {
    const { incomeId } = useParams();
    const history = useHistory();

    const [price, setValue] = useState('');
    const [data, setData] = useState([]);
    const [trueLandId, setTrueLandId] = useState('');
    const [selectedLandId, setSelectedLandId] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('english');


    useEffect(() => {

        submitSets(submitCollection.getincomebyid, "/" + incomeId, true).then(res => {
            if (res && res.status) {
                setData(res.extra)
                setValue(res.extra.price);
                setTrueLandId(res.extra.landId)
   
            } else {
                alertService.error("No Lots");
            };
        });
    }, [incomeId]);

    console.log(price)

    console.log("selected land id: " + selectedLandId)
    console.log("true land id : ",trueLandId)

    if(trueLandId != selectedLandId && selectedLandId != ''){
        history.push('/manageincome')
    }

    const handleSubmit = () => {
        const dataToSend = {
            price: price,
        };

        console.log(dataToSend);
        let sendobjoriginal = JSON.parse(JSON.stringify(submitCollection.updateprice));
        let sendobj = submitCollection.updateprice;
        sendobj.url = (sendobj.url + '/' + incomeId);

        submitSets(submitCollection.updateprice, dataToSend, true).then(res => {
            console.log(sendobjoriginal);
            sendobj.url = sendobjoriginal.url
            if (res && res.status) {
                alertService.success("Price Updated successfully!")
                history.push("/manageIncome")
            } else {
                alertService.error("Error updating price");
            };
        });


        /* axios
        .put(`http://localhost:8080/service/master/updatePrice/${incomeId}`, dataToSend)
        .then((response) => {
            if (response.data && response.data.status) {
                alertService.success("Price Updated successfully!");
            } else {
                alertService.error("Error updating price");
            }
        })
        .catch((error) => {
            console.error("Error updating price:", error);
            alertService.error("Error updating price");
        }); */
    }

    return (
        <div className='updateincome'>
            <div className='lotnavbar'>
                <Navbar
                    selectedLandId={selectedLandId}
                    onLandChange={setSelectedLandId}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                />
            </div>
            <div className="AddLandCard">
                <Container className="container">
                    <Row className="justify-content-center">
                        <Col sm={6}>
                            <Card className="card-container">
                                <Card.Header className="card-title">Update Income</Card.Header>
                                <Card.Body>
                                    <Form>
                                        <Form.Group controlId="month">
                                            <Form.Label className="form-label">Month</Form.Label>
                                            <Form.Control
                                                className="input-field"
                                                type="text"
                                                placeholder="Lot Name"
                                                value={data.month}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="value">
                                            <Form.Label className="form-label">Value</Form.Label>
                                            <Form.Control
                                                className="input-field"
                                                type="text"
                                                placeholder="Value"
                                                value={price}
                                                onChange={(e) => setValue(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Button
                                            className="submit-button"
                                            variant="primary"
                                            onClick={handleSubmit}
                                        >
                                            Update
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default UpdateIncome;
