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
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const UpdateIncome = () => {
    const { incomeId } = useParams();
    const history = useHistory();

    const [price, setValue] = useState('');
    const [data, setData] = useState([]);
    const [trueLandId, setTrueLandId] = useState('');
    const [selectedLandId, setSelectedLandId] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('english');

    const { t, i18n } = useTranslation();

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };


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
    console.log("true land id : ", trueLandId)

    if (trueLandId != selectedLandId && selectedLandId != '') {
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

    }

    return (
        <div className='updateincome-app-screen'>
            <p className='main-heading'>{t('updateincome')}</p>

            <div className="position-absolute top-0 end-0 mt-2 me-2">
                <Dropdown alignRight onSelect={handleLanguageChange}>
                    <Dropdown.Toggle variant="secondary" style={{ background: 'none', border: 'none' }}>
                        <FaGlobeAmericas style={{ color: 'white' }} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="en">English</Dropdown.Item>
                        <Dropdown.Item eventKey="sl">Sinhala</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className="AddLandCard">
                
                <div className="content">
                    <input
                        className="input-field"
                        type="text"
                        placeholder={t('month')}
                        value={data.month}
                    />

                    <input
                        className="input-field"
                        type="text"
                        placeholder="Value"
                        value={price}
                        onChange={(e) => setValue(e.target.value)}
                    />

                    <Button
                        className="add-button"
                        onClick={handleSubmit}
                    >
                        {t('update')}
                    </Button>

                </div>
            </div>
            <div className='footer-alignment'>
                <Footer />
            </div>
        </div>
    );
};

export default UpdateIncome;
