import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './workerpage.css';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import Footer from '../footer/footer';
import Header from '../header/header';
import { Form, Button, Container, Col, Row, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useHistory, useLocation } from "react-router-dom";
import { FaGlobeAmericas, FaLanguage, FaMapMarker } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';


const WorkerPage = ({ selectedLandId, setSelectedLandId }) => {

  const { t, i18n } = useTranslation();


  const location = useLocation();
  const basicDetails = location.state ? location.state.basicDetails : {};
  const paymentDetails = location.state ? location.state.paymentDetails : {};

  //const basicDetails = location.state ? location.state : {};

  console.log('LS: ', location.state);
  console.log('BD: ', basicDetails);
  console.log('PD: ', paymentDetails);
  const [showBasicDetails, setShowBasicDetails] = useState(true);

  const [name, setName] = useState(basicDetails.name || '');
  const [dob, setDob] = useState(basicDetails.dob || '');
  const [nic, setNic] = useState(basicDetails.nic || '');
  const [gender, setGender] = useState(basicDetails.gender || '');
  const [joinedDate, setJoinedDate] = useState(basicDetails.joinedDate || null);
  const [phone, setPhone] = useState(basicDetails.phone || '');
  const [address, setAddress] = useState(basicDetails.address || '');
  const [workerStatus, setWorkerStatus] = useState(basicDetails.workerStatus || '');

  const [paymentType, setPaymentType] = useState(paymentDetails.paymentType || '');
  const [basePayment, setBasePayment] = useState(paymentDetails.basePayment || '');
  const [extraPayment, setExtraPayment] = useState(paymentDetails.extraPayment || '');
  const [attendancePayment, setAttendancePayment] = useState(paymentDetails.attendancePayment || '');


  const [workerId, setWorkerId] = useState(basicDetails.id || -1);
  const [paymentId, setPaymentId] = useState(paymentDetails.id || -1);

  const [landNames, setLandNames] = useState([]);
  const [landName, setLandName] = useState([]);

  const isEditing = location.state ? location.state.isEditing : false;

  console.log('base payment: ', paymentDetails.basePayment);
  const history = useHistory();

  const handleLandChange = (event) => {
    console.log("Land : ", event);
    setSelectedLandId(event);
  };

  useEffect(() => {
    submitSets(submitCollection.manageland, false).then((res) => {
      setLandNames(res.extra);
    });

    if (selectedLandId) {
      submitSets(submitCollection.getlandbyid, "?landId=" + selectedLandId, true)
          .then((res) => {
              setLandName(res.extra ? res.extra.name : "All Lands");
          })
          .catch((error) => {
              console.error("Error fetching land by id:", error);
          });
  } else {
      setLandName("All Lands");
  }

  }, [submitCollection.manageland, selectedLandId]);

  const toggleView = () => {
    setShowBasicDetails(!showBasicDetails);
  };

  useEffect(() => {
    // Log the basicDetails when the component mounts
    console.log('Basic Details:', basicDetails);
    console.log('Payment Details:', paymentDetails);
  }, [basicDetails, paymentDetails]);

  console.log(selectedLandId)

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
      landId: selectedLandId
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

  //update worker
  const handleUpdateWorker = () => {
    const updatedWorker = {
      name,
      dob,
      nic,
      gender,
      joinedDate,
      phone,
      address,
      workerStatus,
      landId: selectedLandId
    };

    axios
      .post(`http://localhost:8081/service/master/workerUpdate?workerId=${workerId}`, updatedWorker)
      .then((response) => {
        if (response.status === 200) {
          alertService.success("Worker updated successfully")
          history.push('/manageWorkers')
        } else {
          alertService.error("Updating worker failed")
        }
      })
      .catch((error) => {
        console.error('Error updating worker:', error);
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

  //update payment
  const handleUpdatePayment = () => {
    const updatedPayment = {
      paymentType,
      basePayment,
      extraPayment,
      attendancePayment
    };

    axios
      .post(`http://localhost:8081/service/master/paymentUpdate?paymentId=${paymentId}`, updatedPayment)
      .then((response) => {
        if (response.status === 200) {
          alertService.success("Payment updated successfully")
          history.push('/manageWorkers')
        } else {
          alertService.error("Updating payment failed")
        }
      })
      .catch((error) => {
        console.error('Error updating payment:', error);
      });

  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const goBack = () => {
    history.goBack();
  };

  return (

    <div className="worker-app-screen">
      <Header/>

      <div className="drop-down-container">

        <div className='landsectioncover'>
          <p className="landsection">
            <FaMapMarker style={{ marginRight: '5px' }} />
            Selected Land: {landName}
          </p>
        </div>

        <p className="home-heading">{t('workermanagement')}</p>
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
            {isEditing ? (
              <button className="add-button" onClick={handleUpdateWorker}>
                {t('updateworker')}
              </button>
            ) : (
              <button className="add-button" onClick={handleAddWorker}>
                {t('addworker')}
              </button>
            )}
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
            {isEditing ? (
              <button className="add-button" onClick={handleUpdatePayment}>
                {t('updateworkerpayment')}
              </button>
            ) : (
              <button className="add-button" onClick={handleAddPayment}>
                {t('addworkerpayment')}
              </button>
            )}
            <br />
          </div>
        )}
      </div>

      <br /><br />

      <div className='footer-alignment'>
        <Footer />
      </div>
    </div>

  );
};

const mapStateToProps = (state) => ({
  selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
  setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkerPage);