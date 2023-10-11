import React, { useState } from 'react';
import Axios from 'axios';
import './taskType.css';

const AddTaskType = () => {
  
  const [taskName, setTaskName] = useState('');

  //add task type
  const handleAddTask = () => {
    const addTask = {
        taskName
  };

  Axios.post('http://localhost:8081/service/master/taskSave', addTask)
      .then((response) => {
          console.log('Task type added successfully:', response.data);
      })
      .catch((error) => {
          console.error('Error adding task type:', error);
      });
  };

  return (
    <div className="task-app-screen">
      <div className="content">
        
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
      
      </div>
    </div>
  );
};

export default AddTaskType;
