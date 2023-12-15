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
import { FaGlobeAmericas, FaLanguage, FaMapMarker } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';


const UpdateIncome = ({selectedLandId, setSelectedLandId}) => {
    const { incomeId } = useParams();
    const history = useHistory();

    const [price, setValue] = useState('');
    const [data, setData] = useState([]);
    const [trueLandId, setTrueLandId] = useState('');
    // const [selectedLandId, setSelectedLandId] = useState('');
    const [landNames, setLandNames] = useState([]);
    const [landName, setLandName] = useState([]);

    const { t, i18n } = useTranslation();

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const handleLandChange = (event) => {
        console.log("Land : ", event);
        setSelectedLandId(event);
    };

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });

        submitSets(submitCollection.getlandbyid, "?landId=" + selectedLandId, true).then((res) => {
            setLandName(res.extra.name);
        });

    }, [submitCollection.manageland, selectedLandId]);


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

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className='updateincome-app-screen'>
            <div className='main-heading'>

                <div className="outer-frame d-flex justify-content-between align-items-center">
                    <div className="filter-container d-flex align-items-center">
                        <MdArrowBackIos className="back-button" onClick={goBack} />
                    </div>

                    <div className="filter-container d-flex align-items-center">
                        <div className="land-filter">
                            <Dropdown onSelect={handleLandChange}>
                                <Dropdown.Toggle variant="secondary" style={{ background: 'none', border: 'none' }}>
                                    <FaMapMarker style={{ color: 'white' }} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {landNames.map((land) => (
                                        <Dropdown.Item eventKey={land.id} value={land.id}>
                                            {land.name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div className="language-filter">
                            <Dropdown onSelect={handleLanguageChange}>
                                <Dropdown.Toggle variant="secondary" style={{ background: 'none', border: 'none' }}>
                                    <FaGlobeAmericas style={{ color: 'white' }} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="en">English</Dropdown.Item>
                                    <Dropdown.Item eventKey="sl">Sinhala</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>


            </div>

            <div className="drop-down-container" style={{marginTop: "-11px"}}>

                <div className='landsectioncover'>
                    <p className="landsection">
                        <FaMapMarker style={{ marginRight: '5px' }} />
                        Selected Land: {landName}
                    </p>
                </div>
                <p className="home-heading">{t('updateincome')}</p>
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

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateIncome);
