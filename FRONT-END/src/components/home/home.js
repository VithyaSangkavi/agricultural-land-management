import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './home.css';
import Footer from '../footer/footer';
import { FaGlobeAmericas } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Col, Form } from 'react-bootstrap';


function Home({ setSelectedLandId, selectedLandId }) {
    const [t, i18n] = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');

    const [query, setQuery] = useState('');
    const [task, setTask] = useState([]);
    const [taskNames, setTaskNames] = useState([]);
    const [taskAssigned, setTaskAssigned] = useState([]);
    const [OngoingTasks, setOngoingTasks] = useState([]);
    const [ongoingTaskDate, setOngoingTaskDate] = useState('');
    const [landNames, setLandNames] = useState([]);




    const history = useHistory();

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    };

    console.log("selected land : ", selectedLandId)


    useEffect(() => {
        axios.post('http://localhost:8081/service/master/taskAssignedFindAll').then((response) => {
            setTaskAssigned(response.data);
            console.log("Task Assigned: ", response.data);
        });

        axios.post('http://localhost:8081/service/master/taskFindAll').then((response) => {
            setTask(response.data.extra);
            console.log("Tasks : ", response.data.extra);
        });

        axios.get(`http://localhost:8081/service/master/ongoing-tasks-with-names?landId=${selectedLandId}`).then((response) => {
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

    const handleCardClick = (taskId) => {
        localStorage.setItem('selectedTaskId', taskId);
        console.log("Selected Task ID: ", taskId);
        history.push(`/addTask`);
    };

    // const handleLandChange = (event) => {
    //     const newSelectedLandId = event.target.value;
    //     console.log(newSelectedLandId);
    //     setSelectedLandId(newSelectedLandId);

    //     axios.post(`http://localhost:8081/service/master/findLandIdByName?name=${selectedLandId}`)
    //         .then((response) => {
    //             const landIdTask = response.data.extra;
    //             const taskLand = JSON.stringify(landIdTask);
    //             const landData = JSON.parse(taskLand);
    //             const landId = landData.landId;
    //             setLandId(landId)
    //             console.log('Selected Land Id :', landId);
    //             localStorage.setItem('SelectedLandId', landId);

    //             console.log("selected land : ", selectedLandId)
    //             console.log("landId : ", landId)
    //             axios.get(`http://localhost:8081/service/master/ongoing-tasks-with-names?landId=${selectedLandId}`).then((response) => {
    //                 setOngoingTasks(response.data.extra);
    //                 console.log("Ongoing tasks : ", response.data.extra);

    //             });
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching data:", error);
    //         });
    // }

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });
    }, [submitCollection.manageland]);

    const handleLandChange = (event) => {
        const newSelectedLandId = event.target.value;
        console.log(newSelectedLandId);
        setSelectedLandId(newSelectedLandId);
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

    return (
        <div className="home-app-screen">
            <p className='main-heading'>{t('home')}</p>
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
                <p>{t('ongoingtasks')}</p>
            </div>

            <div className="task-list">
                {OngoingTasks.map((taskAssigned) => (
                    <div key={taskAssigned.id} className="task-card" onClick={() => handleTaskClick(taskAssigned.taskAssignedId)}>
                        <p>{taskAssigned.taskName} - {getFormattedDate(taskAssigned.taskStartDate)}</p>
                    </div>
                ))}
            </div>

            < br />
            <button className="float-new-task-button" onClick={() => history.push('/homeNewTasks')} title="Assign new task">
                <FaPlus />
            </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);