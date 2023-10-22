import React, { useState } from 'react';
import Axios from 'axios';
import './addTaskType.css';
import Footer from '../footer/footer';
import { useHistory } from "react-router-dom";

const AddTaskType = () => {

  const history = useHistory();
  
  const [taskName, setTaskName] = useState('');
  const cropId = localStorage.getItem('CropIdLand');

  //add task type
  const handleAddTask = () => {
    const addTask = {
        taskName,
        cropId
  };

  Axios.post('http://localhost:8081/service/master/taskSave', addTask)
      .then((response) => {
          console.log('Task type added successfully:', response.data);
          history.push('/manageTaskType')
      })
      .catch((error) => {
          console.error('Error adding task type:', error);
      });
  };

  return (
    <div className="task-app-screen">
      <p className='main-heading'>Add Task</p>
          <div className="basic-details">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task Type Name"
              className="input-field"
            />
            <br/>
            <button className="add-button" onClick={handleAddTask}>
              Add
            </button>
          </div>
          <div className='footer-alignment'>
        <Footer />
      </div>
    </div>
  );
};

export default AddTaskType;
