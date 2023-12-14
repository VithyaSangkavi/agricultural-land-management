import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas, FaSearch, FaMapMarker } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import Footer from '../footer/footer';
import '../Income/manage_income.css';
import '../css/common.css';

function ManageIncome({ setSelectedLandId, selectedLandId }) {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [landNames, setLandNames] = useState([]);
    const [landName, setLandName] = useState([]);



    const { i18n, t } = useTranslation();
    const history = useHistory();


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
        if (selectedLandId) {
            axios.get(`http://localhost:8080/service/master/incomeFindByLandId/${selectedLandId}`)
                .then((res) => {
                    setData(res.data.extra);
                    console.log(res.data.extra);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setData([]);
                });
        } else {
            setData([]);
        }
    }, [selectedLandId]);

    console.log(data)


    const filteredData = data.filter((item) => {
        return item.month.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const redirectToInsertIncome = () => {
        history.push({
            pathname: '/insertincome',
            state: { landId: selectedLandId }
        });
    };

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className='manageincome-app-screen'>
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

            <div className='drop-down-container'>

                <div className='landsectioncover' style={{marginTop:"12px"}}>
                    <p className="landsection">
                        <FaMapMarker style={{ marginRight: '5px' }} />
                        Selected Land: {landName}
                    </p>
                </div>

                <p className='home-heading'>{t('manageincome')}</p>

                <button className="add-income-button" onClick={redirectToInsertIncome}>
                    {t('addincome')}
                </button>
            </div>


            <div className="search-container">
                <div className="search-wrapper">
                    <input
                        className='search-field'
                        type="text"
                        placeholder={t('search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="search-icon">
                        <FaSearch />
                    </div>
                </div>
            </div>

            <div className='income-list'>
                {filteredData.map((income) => (
                    <div key={income.id} className="income-card">
                        <Link to={`/updateIncome/${income.id}`} className='custom-link'>

                            <h3>{income.month}</h3>
                            <p>
                                {t('price')}: {income.price}
                            </p>
                        </Link>
                    </div>
                ))}
            </div>

            <div>
                <br />
                <br />
                <br />
            </div>

            <div className='footer-alignment'>
                <Footer />
            </div>



        </div>
    );
}

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageIncome);
