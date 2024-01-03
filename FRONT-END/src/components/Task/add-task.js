import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import Header from '../header/header';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import './add-task.css';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';


const AddTask = ({ selectedLandId }) => {

  const [t, i18n] = useTranslation();

  const history = useHistory();

  const [taskName, setTaskName] = useState('');
  const [taskNames, setTaskNames] = useState([]);
  const [initialSelectedValue, setInitialSelectedValue] = useState('');
  const [selectedDate, setSelectedDate] = useState();
  const [endDate, setEndDate] = useState(null);
  const selectedTaskId = localStorage.getItem('selectedTaskId');
  const taskId = selectedTaskId;
  const startDate = selectedDate;
  const taskAssignedDate = selectedDate;
  const [selectedDates, setSelectedDates] = useState([]);
  

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  console.log("selected land 1: ", selectedLandId)


  useEffect(() => {
    console.log('get land id: ', selectedLandId);
    console.log('get task id: ', selectedTaskId);

    axios.get(`http://localhost:8080/service/master/findTaskNameById/?taskId=${selectedTaskId}`)
      .then((response) => {
        console.log(response.data.extra.taskName)
        setInitialSelectedValue(response.data.extra.taskName);
      })
      .catch((error) => {
        console.error('Error fetching task name:', error);
      });

    //display all task names
    axios.post('http://localhost:8080/service/master/taskFindAll')
      .then((response) => {
        const tasks = response.data.extra;
        const taskNamesArray = Array.isArray(tasks) ? tasks.map((task) => task.taskName) : [];
        setTaskNames(taskNamesArray);
      })
      .catch((error) => {
        console.error('Error fetching task names:', error);
      });
  }, [selectedLandId]);

  //add task type
  const handleAddTaskAssigned = () => {
    const addTaskAssigned = {
      startDate,
      endDate,
      landId: selectedLandId,
      taskId
    };

    axios.post('http://localhost:8080/service/master/task-assigned-save', addTaskAssigned)
      .then((response) => {
        console.log('Task assigned added successfully:', response.data.extra.id);
        console.log('Task id to be stored: ', taskId)
        const assignedId = response.data.extra;
        console.log('Sample test task aasigned id: ', assignedId)
        localStorage.setItem('TaskIDFromTaskAssigned', taskId);
        localStorage.setItem('StartDate', startDate);

        history.push({
          pathname: '/manageTask',
          state: { taskAssignedId: response.data.extra.id }
        });
        
      })
      .catch((error) => {
        console.error('Error adding task assigned:', error);
      });
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };


  const handleSheduleTask = () => {
    history.push('/addsheduledtask');
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="task-app-screen">
      <Header/>

      <div style={{ marginTop: "10%" }}>
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

        <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
  setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTask);