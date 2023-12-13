import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import './add-task.css';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MdArrowBackIos } from "react-icons/md";


const AddTask = () => {

  const [t, i18n] = useTranslation();

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
  const taskAssignedDate = selectedDate;
  const [taskAssignedId, setTaskAssignedId] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

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
        const assignedId = response.data.extra;
        console.log('Sample test task aasigned id: ', assignedId)
        localStorage.setItem('TaskIDFromTaskAssigned', taskId);
        localStorage.setItem('StartDate', startDate);
        // fetchTaskAssignedId();
        history.push('/manageTask')
      })
      .catch((error) => {
        console.error('Error adding task assigned:', error);
      });
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  // const fetchTaskAssignedId = () => {
  //   axios.get(`http://localhost:8081/service/master/task-assigned?taskId=${taskId}`)
  //     .then((response) => {
  //       const taskAssignedId = response.data.extra.id;
  //       setTaskAssignedId(taskAssignedId);

  //       const saveTaskCard = {
  //         taskAssignedDate,
  //         taskAssignedId
  //       };

  //       axios.post('http://localhost:8081/service/master/task-card-save', saveTaskCard)
  //         .then((response) => {
  //           console.log('Task card added', response.data);
  //           localStorage.setItem('taskassignedid', taskAssignedId);
  //         })
  //         .catch((error) => {
  //           console.error('Error adding task card:', error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching task name:', error);
  //     });
  // };

  const handleSheduleTask = () => {
    history.push('/addsheduledtask');
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="task-app-screen">
      <div className="header-bar">
        <MdArrowBackIos className="back-button" onClick={goBack} />
        <p className="main-heading">{t('addtask')}</p>
        <div className="position-absolute top-0 end-0 me-0">
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

      <div>
        <select value={initialSelectedValue} onChange={(e) => setTaskName(e.target.value)} className="inputs">
          {taskNames.map((taskName) => (
            <option key={taskName} value={taskName}>
              {taskName}
            </option>
          ))}
        </select>
      </div>
      <br />

      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        className="inputs"
        placeholderText={t('startdate')}
        dateFormat="MM/dd/yyyy"

      />

      <br /> <br />
      <button className="add-button" onClick={handleAddTaskAssigned}>
        {t('addtask')}
      </button>
      <br />
      <div className='footer-alignment'>
        <Footer />
      </div>
    </div>
  );
};

export default AddTask;