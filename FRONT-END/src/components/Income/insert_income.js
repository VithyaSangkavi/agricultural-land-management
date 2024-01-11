import { useState, useEffect } from 'react';
import '../Income/insert_income.css';
import axios from 'axios';
import Footer from '../footer/footer';
import Header from '../header/header';
import { submitCollection } from '../../_services/submit.service';
import { Form, Button, Col } from 'react-bootstrap';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas, FaMapMarker } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { MdArrowBackIos } from "react-icons/md";
import { useHistory } from "react-router-dom";

const InsertIncome = ({ setSelectedLandId, selectedLandId }) => {

    const history = useHistory();
    const [month, setMonth] = useState('');
    const [price, setValue] = useState('');
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

        submitSets(submitCollection.getlandbyid, "?landId=" + selectedLandId, true).then((res) => {
            setLandName(res.extra.name);
        });

    }, [submitCollection.manageland, selectedLandId]);

    const handleSubmit = () => {
        const dataToSend = {
            month,
            price,
            landId: selectedLandId,
        };

        console.log(dataToSend);

        submitSets(submitCollection.saveincome, dataToSend, false).then(res => {
            if (res && res.status) {
                alertService.success("Income added successfully!")
                //window.location.reload();
                history.push('/manageIncome');
            } else {
                alertService.error("Error saving income");
            };
        });
    }

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className='insertincome-app-screen'>
            <Header />
            <br /> <br/>
            <div className="drop-down-container" style={{ marginTop: "-11px" }}>

                <div className='landsectioncover' style={{ marginTop: "12px" }}>
                    <p className="landsection">
                        <FaMapMarker style={{ marginRight: '5px' }} />
                        Selected Land: {landName}
                    </p>
                </div>

                {/* <p className="home-heading">{t('addincome')}</p> */}

            </div>

            <div className="content">

                <select
                    className="input-field"
                    as="Select"
                    placeholder=""
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                >
                    <option value="">{t('month')}</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="Auguest">Auguest</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>


                <input
                    className="input-field"
                    type="text"
                    placeholder={t('price')}
                    value={price}
                    onChange={(e) => setValue(e.target.value)}
                />

                <Button
                    className="add-button"
                    onClick={handleSubmit}
                >
                    {t('addincome')}
                </Button>

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

export default connect(mapStateToProps, mapDispatchToProps)(InsertIncome);
