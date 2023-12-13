import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './workerpage.css';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import Footer from '../footer/footer';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useHistory, useLocation } from "react-router-dom";
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MdArrowBackIos } from "react-icons/md";

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

    submitSets(submitCollection.saveworker, addWorker, false)
      .then(res => {
        if (res && res.status) {
          alertService.success("Worker added successfully")
          history.push('/manageWorkers')
        } else {
          alertService.error("Adding worker failed")
        }
      })
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

    submitSets(submitCollection.savepayment, addPayment, false)
      .then(res => {
        if (res && res.status) {
          alertService.success("Payment added successfully")
          history.push('/manageWorkers')
        } else {
          alertService.error("Adding payment failed")
        }
      })
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const goBack = () => {
    history.goBack();
  };

  return (

    <div className="worker-app-screen">
      <div className="header-bar">
        <MdArrowBackIos className="back-button" onClick={goBack}/>
        <p className="main-heading">{t('workermanagement')}</p>
        <div className="position-absolute top-0 end-0 me-0">
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
      </div>

      <div className="toggle-container">
        <button className={`toggle-button ${showBasicDetails ? 'active' : ''}`} onClick={toggleView}>
          {t('basicdetails')}
        </button>
        <button className={`toggle-button ${showBasicDetails ? '' : 'active'}`} onClick={toggleView}>
          {t('finance')}
        </button>
      </div>
      <div className="content">
        {showBasicDetails ? (
          <div className="basic-details">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('name')}
              className="input-field"
            />
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DOB"
              className="input-field"
            />
            {/* <DatePicker
              selected={joinedDate}
              onChange={(date) => setJoinedDate(date)}
              className="input-dates"
              placeholderText={t('Joined Date')}
              dateFormat="MM/dd/yyyy"
            /> */}

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
              <option value="">{t('gender')}</option>
              <option value="Male">{t('male')}</option>
              <option value="Female">{t('female')}</option>
            </select>
            <input
              type="text"
              value={joinedDate}
              onChange={(e) => setJoinedDate(e.target.value)}
              placeholder={t('joineddate')}
              className="input-field"
            />
            {/* <DatePicker
              selected={joinedDate}
              onChange={(date) => setJoinedDate(date)}
              className="input-dates"
              placeholderText={t('joineddate')} // Use the translated placeholder text
              dateFormat="MM/dd/yyyy"
            /> */}
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phone')}
              className="input-field"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('address')}
              className="input-field"
            />
            <select
              value={workerStatus}
              onChange={(e) => setWorkerStatus(e.target.value)}
              className="input-field"
            >
              <option value="">{t('status')}</option>
              <option value="Active">{t('active')}</option>
              <option value="Inactive">{t('retired')}</option>
              <option value="Inactive">{t('fired')}</option>
              <option value="Inactive">{t('temporarystopped')}</option>
            </select>
            <button className="add-button" onClick={handleAddWorker}>
              {t('addworker')}
            </button>
            <br />
          </div>
        ) : (
          <div className="finance">
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="input-field"
            >
              <option value="">{t('monthlydailypay')}</option>
              <option value="monthly">{t('monthly')}</option>
              <option value="daily">{t('daily')}</option>
            </select>
            <input
              type="text"
              value={basePayment}
              onChange={(e) => setBasePayment(e.target.value)}
              placeholder={t('basepayment')}
              className="input-field"
            />
            <input
              type="text"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              placeholder={t('extrapayment')}
              className="input-field"
            />
            <input
              type="text"
              value={attendancePayment}
              onChange={(e) => setAttendancePayment(e.target.value)}
              placeholder={t('attendancepayment')}
              className="input-field"
            />

            <button className="add-button" onClick={handleAddPayment}>
              {t('addworkerpayment')}
            </button>
            <br />
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