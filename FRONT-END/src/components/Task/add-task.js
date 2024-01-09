import React, { useState, useEffect } from 'react';
import Footer from '../footer/footer';
import Header from '../header/header';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import './add-task.css';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';


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

    submitSets(submitCollection.findTaskNameById, '?taskId=' + selectedTaskId, true)
      .then((response) => {
        console.log(response.extra.taskName)
        setInitialSelectedValue(response.extra.taskName);
      })
      .catch((error) => {
        console.error('Error fetching task name:', error);
      });

    //display all task names
    submitSets(submitCollection.taskFindAll, true)
      .then((response) => {
        const tasks = response.extra;
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

    submitSets(submitCollection.task_assigned_save, addTaskAssigned, true)
      .then((response) => {
        console.log('Task assigned added successfully:', response.extra.id);
        console.log('Task id to be stored: ', taskId)
        const assignedId = response.extra;
        console.log('Sample test task aasigned id: ', assignedId)
        localStorage.setItem('TaskIDFromTaskAssigned', taskId);
        localStorage.setItem('StartDate', startDate);

        history.push({
          pathname: '/manageTask',
          state: { taskAssignedId: response.extra.id }
        });

      })
      .catch((error) => {
        console.error('Error adding task assigned:', error);
      });
  };

  return (
    <div className="task-app-screen">
      <Header />
      <br />
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