import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './home.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Footer from '../footer/footer';

function Home() {

    const [lands, setLands] = useState([]);
    const [selectedLand, setSelectedLand] = useState('');

    const [searchQuery, setSearchQuery] = useState('');

    const [query, setQuery] = useState('');
    const [task, setTask] = useState([]);
    const [taskNames, setTaskNames] = useState([]);
    const [taskAssigned, setTaskAssigned] = useState([]);

    const history = useHistory();

    useEffect(() => {
        axios.post('http://localhost:8080/service/master/taskAssignedFindAll').then((response) => {
            setTaskAssigned(response.data);
            console.log("Task Assigned: ", response.data);
        });

        axios.post('http://localhost:8080/service/master/taskFindAll').then((response) => {
            setTask(response.data.extra);
            console.log("Tasks : ", response.data.extra);
        });

        axios.get('http://localhost:8080/service/master/landFindAll').then((response) => {
            setLands(response.data.extra);
            console.log("Lands : ", response.data.extra);
        });
    }, []);

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

    const handleSelectedLand = (eventkey) => {
        setSelectedLand(eventkey);

        axios.post(`http://localhost:8080/service/master/findLandIdByName?name=${eventkey}`)
            .then((response) => {
                const landIdTask = response.data.extra;
                const taskLand = JSON.stringify(landIdTask);
                const landData = JSON.parse(taskLand);
                const landId = landData.landId;
                console.log('Selected Land Id :', landId);
                localStorage.setItem('SelectedLandId', landId);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const handleChange = (event) => {
        setQuery(event.target.value);
    };
    const filteredTaskAssigned = Array.isArray(taskAssigned)
        ? taskAssigned.filter((task) => task.taskAssignedId)
        : [];


    return (
        <div className="home-app-screen">
            <div className='drop-down-container'>
                <Dropdown onSelect={handleSelectedLand} className='custom-dropdown'>
                    <Dropdown.Toggle className='drop-down' id="dropdown-land">
                        {selectedLand || 'Select Land'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='drop-down-menu'>
                        {lands.map((land) => (
                            <div key={land.id}>
                                <Dropdown.Item eventKey={land.name}>{land.name}</Dropdown.Item>
                            </div>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <br />
            </div>
            <div className='home-heading'>
                <p>Ongoing Tasks</p>
            </div>
            <div className="task-list">
                {filteredTaskAssigned.map((taskAssigned) => (
                    <div key={taskAssigned.id} className="task-card" onClick={() => handleCardClick(taskAssigned.id)}>
                        <p>{taskAssigned.taskName}</p>
                    </div>
                ))}
            </div>
            <div className='home-heading'>
                <p>New Task</p>
            </div>
            <div className="task-list">
                {filteredTasks.map((task) => (
                    <div key={task.id} className="task-card" onClick={() => handleCardClick(task.id)}>
                        <p>{task.taskName}</p>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default Home;
