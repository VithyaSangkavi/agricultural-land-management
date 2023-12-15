import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../footer/footer';
import '../lot/manage_lot.css';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Col, Form } from 'react-bootstrap';
import { alertService } from '../../_services/alert.service';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas, FaLanguage, FaSearch, FaMapMarker } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';

const ManageLot = ({ setSelectedLandId, selectedLandId }) => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [landNames, setLandNames] = useState([]);
    const [landName, setLandName] = useState([]);
    const history = useHistory();
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
        if (selectedLandId && selectedLandId !== "") {
            submitSets(submitCollection.managelot, "/" + selectedLandId, true).then(res => {


                if (res.extra.length === 0) {
                    alertService.info('No Data Found !');
                }
                if (res && res.status) {
                    setData(res.extra);
                }

            });
        }
    }, [selectedLandId, submitCollection.managelot]);

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

    const goBack = () => {
        history.goBack();
    };

    const filteredData = data.filter((item) => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className='managelot-app-screen'>
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

            <br />

            <div className="drop-down-container" style={{ marginTop: "-25px" }}>

                <div className='landsectioncover'>
                    <p className="landsection">
                        <FaMapMarker style={{ marginRight: '5px' }} />
                        Selected Land: {landName}
                    </p>
                </div>

                <p className="home-heading">{t('managelots')}</p>

                <button className="add-worker-button" onClick={redirectToInsertLot}>
                    {t('addlot')}
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

            <div className='lot-list'>
                {filteredData.map((lot) => (
                    <div key={lot.id} className="lot-card">
                        <h3>{lot.name}</h3>
                        <p>{t('area')}: {lot.area} {lot.areaUOM}</p>
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
};

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageLot);
