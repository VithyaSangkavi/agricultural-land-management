import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './managetasktypes.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Footer from '../footer/footer';

function ManageTaskTypes() {

  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);

  const history = useHistory();

  useEffect(() => {

    axios.post('http://localhost:8081/service/master/taskFindAll').then((response) => {
      setTasks(response.data.extra);
      console.log("Tasks : ", response.data.extra);
    });

    axios.get('http://localhost:8081/service/master/landFindAll').then((response) => {
      setLands(response.data.extra);
      console.log("Lands : ", response.data.extra);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredTasks = tasks.filter((tasks) =>
    tasks.taskName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLand = (eventKey) => {
    setSelectedLand(eventKey);

    axios.post(`http://localhost:8081/service/master/findLandIdByName?name=${eventKey}`)
      .then((response) => {
        const landIdTask = response.data.extra;
        const taskLand = JSON.stringify(landIdTask);
        const landData = JSON.parse(taskLand);
        const landId = landData.landId;
        console.log('Land ID Task :', landId);

        //get crop id by using landid
        axios.get(`http://localhost:8081/service/master/cropFindByLandId/${landId}`)
          .then((response) => {
            const cropIdLand = response.data.cropId.extra;
            localStorage.setItem('CropIdLand', cropIdLand);
            console.log('Crop API Response:', response.data);

            console.log('Crop ID From Land :', cropIdLand);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

  };

  const AddTaskType = () => {
    history.push('/addTaskType')
  }

  return (
    <div className="task-app-screen">
      <p className='main-heading'>Task Management</p>
      <div className='drop-down-container'>
        <Dropdown onSelect={handleSelectLand} className='custom-dropdown'>
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
        <button className="add-task-type-button" onClick={AddTaskType}>
          Add Task Type
        </button>
      </div>
      <div>
        <input
          className='search-field'
          type="text"
          placeholder="Search Task Types"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-card">
            <p>Task Type: {task.taskName}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default ManageTaskTypes;
