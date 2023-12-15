import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './completed-task.css';
import Footer from '../footer/footer';
import { FaGlobeAmericas, FaMapMarker } from 'react-icons/fa';
import { Col, Form } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { submitSets } from '../UiComponents/SubmitSets';
import { submitCollection } from '../../_services/submit.service';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { alertService } from '../../_services/alert.service';

import { MdArrowBackIos } from "react-icons/md";

function Home({ setSelectedLandId, selectedLandId }) {
    const [t, i18n] = useTranslation();


    const [landNames, setLandNames] = useState([]);
    const [landName, setLandName] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');

    const [query, setQuery] = useState('');
    const [task, setTask] = useState([]);
    const [taskAssigned, setTaskAssigned] = useState([]);
    const [OngoingTasks, setOngoingTasks] = useState([]);

    const history = useHistory();

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
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

        axios.get(`http://localhost:8080/service/master/completed-tasks-with-names?landId=${selectedLandId}`).then((response) => {

            setOngoingTasks(response.data.extra);
            console.log("Ongoing tasks : ", response.data.extra);

        });
    }, [selectedLandId]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const filteredTasks = task.filter((task) =>
        task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleChange = (event) => {
        setQuery(event.target.value);
    };
    const filteredTaskAssigned = Array.isArray(taskAssigned)
        ? taskAssigned.filter((task) => task.taskAssignedId)
        : [];

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
        <div className="home-app-screen">
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

            <div className="drop-down-container">
                <div className='landsectioncover'>
                    <p className="landsection">
                        <FaMapMarker style={{ marginRight: '5px' }} />
                        Selected Land: {landName}
                    </p>
                </div>

                <p className="home-heading">{t('completedtasks')}</p>
            </div>

            <div className="task-list">
                {OngoingTasks.map((taskAssigned) => (
                    <div key={taskAssigned.id} className="task-card" onClick={() => handleTaskClick(taskAssigned.taskAssignedId)}>
                        <p>{taskAssigned.taskName} - {getFormattedDate(taskAssigned.taskStartDate)} - land {taskAssigned.landId}</p>
                    </div>
                ))}
            </div>

            <br />
            <br />
            <br />

            <Footer />
        </div>
    );
}

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);