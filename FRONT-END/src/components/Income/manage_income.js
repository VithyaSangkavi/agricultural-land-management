import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas, FaSearch } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import Footer from '../footer/footer';
import '../Income/manage_income.css';

function ManageIncome({ setSelectedLandId, selectedLandId }) {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    // const [selectedLandId, setSelectedLandId] = useState('1');
    const [landNames, setLandNames] = useState([]);


    const { i18n, t } = useTranslation();
    const history = useHistory();


    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const handleLandChange = (event) => {
        const newSelectedLandId = event.target.value;
        setSelectedLandId(newSelectedLandId);
    };

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });
    }, [submitCollection.manageland]);

    useEffect(() => {
        if (selectedLandId) {
            axios.get(`http://localhost:8081/service/master/incomeFindByLandId/${selectedLandId}`)
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


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

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
                <div className="outer-frame d-flex justify-content-between">
                    <p className='page-name'>{t('manageincome')}</p>
                    <div className="land-filter">
                        <Dropdown className='custom-dropdown'>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Control as="select" value={selectedLandId} onChange={handleLandChange}>
                                        {landNames.map((land) => (
                                            <option key={land.id} value={land.id}>
                                                {land.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Dropdown>
                    </div>

                    <div className="language-filter me-2">
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

                </div>
            </div>

            <div className='drop-down-container'>
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
                {data.map((income) => (
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
