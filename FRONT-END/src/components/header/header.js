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
import { MdArrowBackIos } from "react-icons/md";

function Header({ setSelectedLandId, selectedLandId }) {
    const [t, i18n] = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');

    const [query, setQuery] = useState('');
    const [task, setTask] = useState([]);
    const [taskAssigned, setTaskAssigned] = useState([]);
    const [OngoingTasks, setOngoingTasks] = useState([]);
    const [landNames, setLandNames] = useState([]);
    const [landName, setLandName] = useState([]);
    const [cropName, setCropName] = useState('');

    const history = useHistory();

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    };

    console.log("selected land : ", selectedLandId);

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
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

        axios.get(`http://localhost:8080/service/master/cropNameFindByLandId/${selectedLandId}`)
            .then((response) => {
                setCropName(response.data.cropName.extra);
                console.log('crop name header: ', cropName);

            })
            .catch((error) => {
                console.error('Error fetching task card id:', error);
            });
    }, [submitCollection.manageland, selectedLandId]);


    const handleLandChange = (event) => {
        console.log("Land : ", event);
        setSelectedLandId(event);
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };
    const handleTaskClick = (taskAssignedid) => {
        history.push(`/manageOngoingTask/${taskAssignedid}`);
        console.log("task assigned : ", taskAssignedid);
    };


    const goBack = () => {
        history.goBack();
    };

    return (
        <div className='header-main'>

            <div className="outer-frame d-flex">
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
                                <Dropdown.Item eventKey="">All Lands</Dropdown.Item>
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
    );
}

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);