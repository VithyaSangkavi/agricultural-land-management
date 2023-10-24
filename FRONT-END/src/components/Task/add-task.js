import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import './add-task.css'

const AddTask = () => {

  const history = useHistory();

  const [taskName, setTaskName] = useState('');
  const [taskNames, setTaskNames] = useState([]);
  const [initialSelectedValue, setInitialSelectedValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const selectedTaskId = localStorage.getItem('selectedTaskId');

    axios.get(`http://localhost:8081/service/master/findTaskNameById/?taskId=${selectedTaskId}`)
      .then((response) => {
        console.log(response.data.extra.taskName)
        setInitialSelectedValue(response.data.extra.taskName);
      })
      .catch((error) => {
        console.error('Error fetching task name:', error);
      });

    //display all task names
    axios.post('http://localhost:8081/service/master/taskFindAll')
      .then((response) => {
        const tasks = response.data.extra;
        const taskNamesArray = Array.isArray(tasks) ? tasks.map((task) => task.taskName) : [];
        setTaskNames(taskNamesArray);
      })
      .catch((error) => {
        console.error('Error fetching task names:', error);
      });


  }, []);

  //add task type
  const handleAddTask = () => {
    const addTask = {
      selectedDate,
      endDate
    };

    axios.post('http://localhost:8081/service/master/taskSave', addTask)
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
      <div>
        <select value={initialSelectedValue} onChange={(e) => setTaskName(e.target.value)} className="inputs">
          {taskNames.map((taskName) => (
            <option key={taskName} value={taskName}>
              {taskName}
            </option>
          ))}
        </select>
      </div>
      <br/>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)} // Set the selected date
        className="inputs"
        placeholderText="Start Date" // Set the placeholder text
        dateFormat="MM/dd/yyyy" // Define the date format
      />
      <br/> <br/>
       <button className="add-button" onClick={handleAddTask}>
              Add Task
            </button>
      <div className='footer-alignment'>
        <Footer />
      </div>
    </div>
  );
};

export default AddTask;
