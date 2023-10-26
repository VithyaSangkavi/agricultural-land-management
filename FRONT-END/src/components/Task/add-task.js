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
  const [selectedDate, setSelectedDate] = useState();
  const [endDate, setEndDate] = useState(null);
  const landId = localStorage.getItem('SelectedLandId')
  const selectedTaskId = localStorage.getItem('selectedTaskId');
  const taskId = selectedTaskId;
  const startDate = selectedDate;

  useEffect(() => {
    console.log('get land id: ', landId);
    console.log('get task id: ', selectedTaskId);

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
  const handleAddTaskAssigned = () => {
    const addTaskAssigned = {
      startDate,
      endDate,
      landId,
      taskId
    };

    axios.post('http://localhost:8081/service/master/task-assigned-save', addTaskAssigned)
      .then((response) => {
        console.log('Task assigned added successfully:', response.data);
        console.log('Task id to be stored: ', taskId)
        localStorage.setItem('TaskIDFromTaskAssigned', taskId);
        localStorage.setItem('StartDate', startDate);
        history.push('/manageTask')
      })
      .catch((error) => {
        console.error('Error adding task assigned:', error);
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
       <button className="add-button" onClick={handleAddTaskAssigned}>
              Add Task
            </button>
      <div className='footer-alignment'>
        <Footer />
      </div>
    </div>
  );
};

export default AddTask;
