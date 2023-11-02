import React, { useState } from 'react';
import Axios from 'axios';
import './addTaskType.css';
import Footer from '../footer/footer';
import { useHistory } from "react-router-dom";
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';

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

  submitSets(submitCollection.savetasktype, addTask, false)
    .then(res => {
      if (res && res.status) {
        alertService.success("Task type added successfully")
        history.push('/manageTaskType')
      } else {
        alertService.error("Error adding Task type")
      }
    })
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
