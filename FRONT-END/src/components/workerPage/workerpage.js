import React, { useState } from 'react';
import './workerpage.css';

const WorkerPage = () => {
  const [showBasicDetails, setShowBasicDetails] = useState(true);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [nic, setNic] = useState('');
  const [gender, setGender] = useState('');
  const [joinedDate, setJoinedDate] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [workerStatus, setWorkerStatus] = useState('');


  const toggleView = () => {
    setShowBasicDetails(!showBasicDetails);
  };

  const handleAddClick = () => {
    
  };

  return (
    <div className="worker-app-screen">
      <div className="toggle-container">
        <button className={`toggle-button ${showBasicDetails ? 'active' : ''}`} onClick={toggleView}>
          Basic Details
        </button>
        <button className={`toggle-button ${showBasicDetails ? '' : 'active'}`} onClick={toggleView}>
          Finance
        </button>
      </div>
      <div className="content">
        {showBasicDetails ? (
          <div className="basic-details">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="input-field"
            />
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="Date of Birth"
              className="input-field"
            />
            <input
              type="text"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              placeholder="NIC"
              className="input-field"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="input-field"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="text"
              value={joinedDate}
              onChange={(e) => setJoinedDate(e.target.value)}
              placeholder="Joined Date"
              className="input-field"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="input-field"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="input-field"
            />
            <select
              value={workerStatus}
              onChange={(e) => setWorkerStatus(e.target.value)}
              className="input-field"
            >
              <option value="">Select Worker Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button className="add-button" onClick={handleAddClick}>
              Add
            </button>
          </div>
        ) : (
          <div className="finance">
            <h2>Finance</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerPage;
