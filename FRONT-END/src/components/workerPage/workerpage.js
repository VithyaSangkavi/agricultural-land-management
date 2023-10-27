import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './workerpage.css';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import Footer from '../footer/footer';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import { useHistory, useLocation } from "react-router-dom";
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const WorkerPage = () => {
  
  const { t, i18n } = useTranslation();
  
  const location = useLocation();
  const basicDetails = location.state ? location.state.basicDetails : {};
  const [showBasicDetails, setShowBasicDetails] = useState(true);

  const [name, setName] = useState(basicDetails.name || '');
  const [dob, setDob] = useState(basicDetails.dob || '');
  const [nic, setNic] = useState(basicDetails.nic || '');
  const [gender, setGender] = useState(basicDetails.gender || '');
  const [joinedDate, setJoinedDate] = useState(basicDetails.joinedDate || null);
  const [phone, setPhone] = useState(basicDetails.phone || '');
  const [address, setAddress] = useState(basicDetails.address || '');
  const [workerStatus, setWorkerStatus] = useState(basicDetails.workerStatus || '');
  const storedLandData = localStorage.getItem('selectedLandIdWorker');

  const landData = JSON.parse(storedLandData);
  const landId = landData.landId;
  console.log('Land ID:', landId);

  const [workerId, setWorkerId] = useState(basicDetails.id || -1);
  const [paymentType, setPaymentType] = useState('');
  const [basePayment, setBasePayment] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [attendancePayment, setAttendancePayment] = useState('');

  const history = useHistory();

  const toggleView = () => {
    setShowBasicDetails(!showBasicDetails);
  };

  useEffect(() => {
    // Log the basicDetails when the component mounts
    console.log('Basic Details:', basicDetails);
  }, [basicDetails]);

  //Add Worker
  const handleAddWorker = () => {
    const addWorker = {
      name,
      dob,
      nic,
      gender,
      joinedDate,
      phone,
      address,
      workerStatus,
      landId
    };

    // submitSets(submitCollection.saveworker, addWorker, false)
    //   .then(res => {
    //     if (res && res.status) {
    //       alertService.success("Worker added successfully")
    //     } else {
    //       alertService.error("Adding worker failed")
    //     }
    //   })

    Axios.post('http://localhost:8081/service/master/workerSave', addWorker)
      .then((response) => {
        console.log("get land id: ", landId)
        console.log('Worker added successfully:', response.data);
        history.push('/manageWorkers')
      })
      .catch((error) => {
        console.error('Error adding worker:', error);
      });
  };


  //Add Payment
  const handleAddPayment = () => {
    const addPayment = {
      workerId,
      paymentType,
      basePayment,
      extraPayment,
      attendancePayment
    };

    // submitSets(submitCollection.savepayment, addPayment, false)
    //   .then(res => {
    //     if (res && res.status) {
    //       alertService.success("Payment added successfully")
    //     } else {
    //       alertService.error("Adding payment failed")
    //     }
    //   })

    Axios.post('http://localhost:8081/service/master/paymentSave', addPayment)
      .then((response) => {
        console.log("worker id: ", workerId)
        console.log('Payment added successfully:', response.data);
        history.push('/manageWorkers')
      })
      .catch((error) => {
        console.error('Error adding payment:', error);
      });
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (

    <div className="worker-app-screen">
      <p className='main-heading'>Worker Registration</p>
      <div className="position-absolute top-0 end-0 mt-2 me-2">
        <DropdownButton
          id="dropdown-language"
          title={<FaLanguage />}
          onSelect={handleLanguageChange}
          variant="secondary"
        >
          <Dropdown.Item eventKey="en">
            <FaGlobeAmericas /> English
          </Dropdown.Item>
          <Dropdown.Item eventKey="sl">
            <FaGlobeAmericas /> Sinhala
          </Dropdown.Item>
        </DropdownButton>
      </div>
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
              placeholder="DOB"
              className="input-field"
            />
            <input
              type="text"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              placeholder="NIC/ID"
              className="input-field"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="input-field"
            >
              <option value="">Gender</option>
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
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Retired</option>
              <option value="Inactive">Fired</option>
              <option value="Inactive">Temporary Stopped</option>
            </select>
            <button className="add-button" onClick={handleAddWorker}>
              Add
            </button>
          </div>
        ) : (
          <div className="finance">
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="input-field"
            >
              <option value="">Monthly/Daily pay</option>
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </select>
            <input
              type="text"
              value={basePayment}
              onChange={(e) => setBasePayment(e.target.value)}
              placeholder="Base Payment"
              className="input-field"
            />
            <input
              type="text"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              placeholder="Extra Kg Pay"
              className="input-field"
            />
            <input
              type="text"
              value={attendancePayment}
              onChange={(e) => setAttendancePayment(e.target.value)}
              placeholder="Attendance Pay"
              className="input-field"
            />

            <button className="add-button" onClick={handleAddPayment}>
              Add
            </button>
          </div>
        )}
      </div>
      <div className='footer-alignment'>
        <Footer />
      </div>
    </div>

  );
};

export default WorkerPage;
