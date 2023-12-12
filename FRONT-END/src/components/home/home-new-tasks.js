import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './home.css';
import Footer from '../footer/footer';
import { Col, Form } from 'react-bootstrap';
import { FaGlobeAmericas } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MdArrowBackIos } from "react-icons/md";
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';

function HomeNewTasks({ setSelectedLandId, selectedLandId }) {
    const [t, i18n] = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');

    const [query, setQuery] = useState('');
    const [task, setTask] = useState([]);
    const [taskAssigned, setTaskAssigned] = useState([]);
    const [landNames, setLandNames] = useState([]);

    const history = useHistory();

    useEffect(() => {
        axios.post('http://localhost:8081/service/master/taskAssignedFindAll').then((response) => {
            setTaskAssigned(response.data);
            console.log("Task Assigned: ", response.data);
        });

        axios.post('http://localhost:8081/service/master/taskFindAll').then((response) => {
            setTask(response.data.extra);
            console.log("Tasks : ", response.data.extra);
        });


    }, []);

    const handleLandChange = (event) => {
        const newSelectedLandId = event.target.value;
        console.log(newSelectedLandId);
        setSelectedLandId(newSelectedLandId);
    };

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });
    }, [submitCollection.manageland]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const filteredTasks = task.filter((task) =>
        task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardClick = (taskId) => {
        localStorage.setItem('selectedTaskId', taskId);
        console.log("Selected Task ID: ", taskId);
        history.push(`/addTask`);
    };


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
        history.goBack(); // Go back to the previous page
    };

    return (
        <div className="home-app-screen">
            <div className="header-bar">
                <MdArrowBackIos className="back-button" onClick={goBack} />
                <p className="main-heading">{t('newtask')}</p>
                <div className="position-absolute top-0 end-0 me-2">
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

            <div className='drop-down-container'>
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
                <br />
            </div>

            <div className='home-heading'>
                <p>{t('newtask')}</p>
            </div>
            <div className="task-list">
                {filteredTasks.map((task) => (
                    <div key={task.id} className="task-card" onClick={() => handleCardClick(task.id)}>
                        <p>{task.taskName}</p>
                    </div>
                ))}
            </div>

            < br />
            <br />
            < br />
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeNewTasks);