import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../footer/footer';
import Header from '../header/header';
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
        if (selectedLandId) {
            submitSets(submitCollection.getlandbyid, "?landId=" + selectedLandId, true)
                .then((res) => {
                    setLandName(res.extra ? res.extra.name : "All Lands");
                })
                .catch((error) => {
                    console.error("Error fetching land by id:", error);
                });
        } else {
            setLandName("All Lands");
        }
    }, [submitCollection.manageland, selectedLandId]);

    useEffect(() => {

        if (selectedLandId === '' || !selectedLandId) {
            // Fetch all lots without filtering based on selectedLandId
            submitSets(submitCollection.findalllot).then(res => {
                if (res && res.status) {
                    setData(res.extra);
                }
            }).catch(error => {
                console.error("Error fetching all lots:", error);
                setData([]);
            });
        } else {
            // Fetch lots for the selected land
            submitSets(submitCollection.managelot, `/${selectedLandId}`, true).then(res => {
                setData(res.extra);

                if (res.extra.length === 0) {
                    alertService.info('No Data Found !');
                }

            }).catch(error => {
                console.error("Error fetching lots for the selected land:", error);
                setData([]);
            });
        }
    }, [selectedLandId, submitCollection.managelot, submitCollection.findalllot]);



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
            <Header/> 
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
                {
                    filteredData.map((lot) => (
                        <div key={lot.id} className="lot-card">
                            <h3>{lot.name}</h3>
                            <p>{t('area')}: {lot.area} {lot.areaUOM}</p>
                        </div>
                    ))
                }

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
