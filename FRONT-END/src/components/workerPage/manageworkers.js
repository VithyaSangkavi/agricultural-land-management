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


  return (
    <div className="worker-app-screen">
      <p className='main-heading'>Worker Management</p>
      <div className='drop-down-container'>
        <Dropdown onSelect={(eventKey) => setSelectedLand(eventKey)} className='custom-dropdown'>
          <Dropdown.Toggle className='drop-down' id="dropdown-land">
            Select Land
          </Dropdown.Toggle>
          <Dropdown.Menu className='drop-down-menu'>
            {lands.map((land) => (
               <div key={land.id} >
              <Dropdown.Item>
                {land.name}
              </Dropdown.Item>
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <br />
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
          <div key={worker.id} className="worker-card">
            <h3>Name: {worker.name}</h3>
            <p>Phone: {worker.phone}</p>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
}

export default ManageWorkers;
