import React, { useState } from 'react';
import Axios from 'axios';
import './addTaskType.css';
import Footer from '../footer/footer';
import { useHistory } from "react-router-dom";
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const AddTaskType = () => {
  const { t, i18n } = useTranslation();

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

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="task-app-screen">
      <p className='main-heading'>{t('addtasktype')}</p>
      <div className="position-absolute top-0 end-0 mt-2 me-2">
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
      <div className="basic-details">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder={t('tasktypename')}
          className="input-field"
        />
        <br />
        <button className="add-button" onClick={handleAddTask}>
          {t('add')}
        </button>
      </div>
      <br/> <br/> <br/>
      <div className='footer-alignment'>
        <Footer />
      </div>
    </div>
  );
};

export default AddTaskType;
