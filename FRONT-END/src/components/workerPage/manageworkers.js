import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './manageworkers.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Footer from '../footer/footer';

function ManageWorkers() {

  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState([]);

  const history = useHistory();

  useEffect(() => {

    axios.post('http://localhost:8081/service/master/workerFindAll').then((response) => {
      setWorkers(response.data.extra);
      console.log("Workers : ", response.data.extra);
    });

    axios.get('http://localhost:8081/service/master/landFindAll').then((response) => {
      setLands(response.data.extra);
      console.log("Lands : ", response.data.extra);
    });
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

    axios.post(`http://localhost:8081/service/master/findLandIdByName?name=${eventKey}`)
      .then((response) => {
        const landIdWorker = response.data.extra;

        localStorage.setItem('selectedLandIdWorker', JSON.stringify(landIdWorker));

        console.log("Stored Land ID: ", landIdWorker);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  
  const handleWorkerCardClick = (worker) => {
    history.push('/addWorker', { basicDetails: worker });
  };

  const filteredWorkersByLandId = workers.filter((worker) => {
    const landIdWorker = localStorage.getItem('selectedLandIdWorker')
    return landIdWorker === '' || worker.landId === landIdWorker;
  });

  return (
    <div className="worker-app-screen">
      <p className='main-heading'>Worker Management</p>
      <div className='drop-down-container'>
      <Dropdown onSelect={handleSelectLand} className='custom-dropdown'>
      <Dropdown.Toggle className='drop-down' id="dropdown-land">
            {selectedLand || 'Select Land'}
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
        Add Worker
      </button>
      </div>
      <div>
        <input
          className='search-field'
          type="text"
          placeholder="Search Workers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="worker-list">
        {filteredWorkers.map((worker) => (
          <div key={worker.id} className="worker-card"
          onClick={() => handleWorkerCardClick(worker)}>
            <h3>Name: {worker.name}</h3>
            <p>Phone: {worker.phone}</p>
          </div>
        ))}
      </div>
      <br/>

      <Footer />
    </div>
  );
}

export default ManageWorkers;