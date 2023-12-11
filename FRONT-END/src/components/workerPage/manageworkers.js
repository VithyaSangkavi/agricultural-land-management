import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './manageworkers.css';
import Footer from '../footer/footer';
import { FaGlobeAmericas, FaLanguage, FaSearch } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import SearchComponent from '../search/search';

function ManageWorkers() {

  const { t, i18n } = useTranslation();

  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState([]);
  const [filteredWorkersForSelectedLand, setFilteredWorkersForSelectedLand] = useState([]);

  const [landId, setLandId] = useState();

  const history = useHistory();

  useEffect(() => {


    axios.post('http://localhost:8080/service/master/workerFindAll').then((response) => {
      setWorkers(response.data.extra);
      console.log("Workers : ", response.data.extra);
    });

    // submitSets(submitCollection.manageworker)
    //   .then((res) => {
    //     setWorkers(res.extra);
    //   })

    axios.get('http://localhost:8080/service/master/landFindAll').then((response) => {
      setLands(response.data.extra);
      console.log("Lands : ", response.data.extra);
    });

    // axios.post('http://localhost:8080/service/master/workerFindAll').then((response) => {
    //   setWorkers(response.data.extra);
    //   console.log("Workers : ", response.data.extra);
    // });


    // submitSets(submitCollection.manageland)
    // .then((res) => {
    //   setLands(res.extra);
    // })
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const AddWorker = () => {
    history.push('/addWorker')
  }

  const handleSelectLand = (eventKey) => {
    setSelectedLand(eventKey);

    axios.post(`http://localhost:8080/service/master/findLandIdByName?name=${eventKey}`)
      .then((response) => {
        const landIdWorker = response.data.extra;
        const thislandId = landIdWorker.landId;

        localStorage.setItem('selectedLandIdWorker', JSON.stringify(landIdWorker));

        setLandId(thislandId);

        axios.get(`http://localhost:8080/service/master/findByLandId?landId=${thislandId}`)
          .then((response) => {
            console.log("Workers for selected land:", response.data.extra);
            setFilteredWorkersForSelectedLand(response.data.extra);
          })
          .catch((error) => {
            console.error("Error fetching workers for the selected land:", error);
          });

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleWorkerCardClick = (worker) => {
    history.push('/addWorker', { basicDetails: worker });
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="worker-app-screen">
      <p className='main-heading'>{t('workermanagement')}</p>
      <div className="position-absolute top-0 end-0 me-2">
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
        <button className="add-worker-button" onClick={AddWorker}>
          {t('addworker')}
        </button>
      </div>
      <br />
      <div className="search-container">
        <div className="search-wrapper">
          <input
            className='search-field'
            type="text"
            placeholder={t('searchworkers')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-icon">
            <FaSearch />
          </div>
        </div>
      </div>

      <div className="worker-list">
        {selectedLand
          ? filteredWorkersForSelectedLand.map((worker) => (
            <div key={worker.id} className="worker-card" onClick={() => handleWorkerCardClick(worker)}>
              <h3>{t('name')}: {worker.name}</h3>
              <p>{t('phone')}: {worker.phone}</p> 
            </div>
          ))
          : filteredWorkers.map((worker) => (
            <div key={worker.id} className="worker-card" onClick={() => handleWorkerCardClick(worker)}>
              <h3>{t('name')}: {worker.name}</h3>
              <p>{t('phone')}: {worker.phone}</p>
            </div>
          ))
        }
      </div>

      <br />
      <div className='footer-alignment'>
        <Footer />
      </div>
    </div>
  );
}

export default ManageWorkers;