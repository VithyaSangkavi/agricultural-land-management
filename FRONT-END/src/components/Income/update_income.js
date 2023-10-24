import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import '../lot/insert_lot.css';
import Footer from '../footer/footer';
import { submitCollection } from '../../_services/submit.service';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';

const UpdateIncome = () => {
    const { incomeId } = useParams();
    const history = useHistory();

    const [price, setValue] = useState('');
    const [data, setData] = useState([]);



    useEffect(() => {

        submitSets(submitCollection.getincomebyid, "/" + incomeId, true).then(res => {
            if (res && res.status) {
                setData(res.extra)
                setValue(res.extra.price);
            } else {
                alertService.error("No Lots");
            };
        });
    }, [incomeId]);

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
                <div className='footer-alignment'>
                    <Footer />
                </div>
            </Container>
        </div>
    );
};

export default UpdateIncome;
