import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './header.css';
import '../css/common.css';
import { FaGlobeAmericas } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaMapMarker } from 'react-icons/fa';
import '../css/common.css';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { setSelectedCropAction } from '../../actions/auth/crop_action';
import { MdArrowBackIos } from "react-icons/md";
import { IoIosLeaf } from "react-icons/io";
import { GiWheat, GiCoconuts } from "react-icons/gi";

function Header({ setSelectedLandId, selectedLandId, setSelectedCrop, selectedCrop }) {
    const [t, i18n] = useTranslation();

    const [landNames, setLandNames] = useState([]);
    const [landName, setLandName] = useState([]);

    const history = useHistory();

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
            console.log('land details : ', landNames);
        });

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

    const handleCropName = (cropName) => {
        console.log("Crop Name:", cropName);
        setSelectedCrop(cropName);
    }

    const handleLandChange = (event) => {
        console.log("Land : ", event);
        setSelectedLandId(event);
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const goBack = () => {
        history.goBack();
    };

    const TeaIcon = () => <IoIosLeaf />;
    const WheatIcon = () => <GiWheat />;
    const CoconutIcon = () => <GiCoconuts />;

    return (
        <div className='header-main'>

            <div className="outer-frame d-flex">
                <div className="filter-container d-flex align-items-center">
                    <MdArrowBackIos className="back-button" onClick={goBack} />
                </div>
            </div>
            <div className='icons-container'>
                <div className="land-filter">
                    <Dropdown onSelect={handleLandChange}>
                        <Dropdown.Toggle variant="secondary" style={{ background: 'none', border: 'none' }}>
                            <FaMapMarker style={{ color: 'white' }} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="">All Lands</Dropdown.Item>
                            {landNames.map((land) => (
                                <Dropdown.Item eventKey={land.id} value={land.id} onClick={() => handleCropName(land.cropName)}>
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

                <div className="crop-icon-container">
                    {selectedCrop === 'Tea' && <TeaIcon />}
                    {selectedCrop === 'Wheat' && <WheatIcon />}
                    {selectedCrop === 'Coconut' && <CoconutIcon />}
                </div>
            </div>

        </div>
    );
}

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
    selectedCrop: state.selectedCrop
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
    setSelectedCrop: setSelectedCropAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);