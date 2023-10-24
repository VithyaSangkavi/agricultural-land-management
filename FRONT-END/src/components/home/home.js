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
    const [task, setTask] = useState([]);

    const history = useHistory();

    useEffect(() => {

        axios.post('http://localhost:8081/service/master/taskFindAll').then((response) => {
            setTask(response.data.extra);
            console.log("Expenses : ", response.data.extra);
        });

        axios.get('http://localhost:8081/service/master/landFindAll').then((response) => {
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

    return (
        <div className="home-app-screen">
            <div className='drop-down-container'>
                <Dropdown className='custom-dropdown'>
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
