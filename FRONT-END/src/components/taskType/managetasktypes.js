import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './managetasktypes.css';
import Footer from '../footer/footer';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function ManageTaskTypes() {

  const { t, i18n } = useTranslation();

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

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="task-app-screen">
      <p className='main-heading'>{t('tasktypemanagement')}</p>
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
      <div className='drop-down-container'>
        <Dropdown onSelect={handleSelectLand} className='custom-dropdown'>
          <Dropdown.Toggle className='drop-down' id="dropdown-land">
            {selectedLand || t('selectland')}
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
          {t('addtasktype')}
        </button>
      </div>
      <div>
        <input
          className='search-field'
          type="text"
          placeholder={t('searchtasktypes')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-card">
            <p>{t('tasktype')}: {task.taskName}</p>
          </div>
        ))}
      </div>
      <br />
      <div className='footer-alignment'>
        <Footer />
      </div>
    </div>
  );
}

export default ManageTaskTypes;
