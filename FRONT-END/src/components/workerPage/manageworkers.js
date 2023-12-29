import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './manageworkers.css';
import '../css/common.css';
import Footer from '../footer/footer';
import { FaGlobeAmericas, FaLanguage, FaSearch, FaMapMarker } from 'react-icons/fa';
import { MdArrowBackIos } from "react-icons/md";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import SearchComponent from '../search/search';
import { alertService } from '../../_services/alert.service';
import { IoIosArrowDown } from "react-icons/io";

function ManageWorkers({ setSelectedLandId, selectedLandId }) {

  const { t, i18n } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState([]);
  const [filteredWorkersForSelectedLand, setFilteredWorkersForSelectedLand] = useState([]);

  const [landNames, setLandNames] = useState([]);
  const [landName, setLandName] = useState([]);

  const [isReqPagination] = useState(true);
  const [maxResult, setMaxResult] = useState(4);
  const [startIndex, setStartIndex] = useState(0);

  const history = useHistory();

  useEffect(() => {

    axios.post('http://localhost:8081/service/master/workerFindAll').then((response) => {
      setWorkers(response.data.extra);
      console.log("Workers : ", response.data.extra);

      if (response.data.extra.length === 0) {
        alertService.info('No Data Found !');
      }
  
    });

  }, []);

  const filteredWorkers = filteredWorkersForSelectedLand.filter((worker) => {
    return worker.name.toLowerCase().includes(searchQuery.toLowerCase())
  });

  const filteredWorkers1 = workers.filter((worker) => {
    return worker.name.toLowerCase().includes(searchQuery.toLowerCase())
  });

  const AddWorker = () => {
    history.push('/addWorker')
  }

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

  const handleLandChange = (event) => {
    console.log("Land : ", event);
    setSelectedLandId(event);
  };

  useEffect(() => {
    const getWorker = {
      landId: parseInt(selectedLandId),
      isReqPagination,
      maxResult,
      startIndex
    }
    
    axios.post(`http://localhost:8081/service/master/findWorkByLandId`, getWorker)
      .then((response) => {

        if (response.data.extra.length === 0) {
          alertService.info('No Data Found !');
        }

        console.log("Workers for selected land:", response.data.extra);

        if (Array.isArray(response.data.extra)) {
          setFilteredWorkersForSelectedLand(response.data.extra);
        } else {
          setFilteredWorkersForSelectedLand([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching workers for the selected land:", error);
      });
  }, [selectedLandId, startIndex]);

  const handleWorkerCardClick = async (worker) => {
    try {
      const workerId = worker.id;

      console.log('worker id: ', workerId);

      const paymentDetailsResponse = await axios.get(`http://localhost:8081/service/master/findByWorkerId?workerId=${workerId}`);
      console.log('payment detals: ', paymentDetailsResponse.data);

      const paymentDetails = paymentDetailsResponse.data.extra;

      history.push('/addWorker', { basicDetails: worker, paymentDetails, isEditing: true });
    } catch (error) {
      console.error('Error fetching worker/payment details:', error);
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const goBack = () => {
    history.goBack();
  };

  const handleLoadMore = () => {
    setStartIndex(startIndex + maxResult);
  };

  const hasMoreWorkers = filteredWorkersForSelectedLand.length < workers.length;

  return (
    <div className="worker-app-screen">
      <div className='main-heading'>

        <div className="outer-frame d-flex justify-content-between align-items-center">
          <div className="filter-container d-flex align-items-center">
            <MdArrowBackIos className="back-button" onClick={goBack} />
          </div>

          <div className="filter-container d-flex align-items-center">
            <div className="land-filter">
              <Dropdown onSelect={handleLandChange}>
                <Dropdown.Toggle variant="secondary" style={{ background: 'none', border: 'none' }}>
                  <FaMapMarker style={{ color: 'white' }} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item eventKey="">All Lands</Dropdown.Item>
                  {landNames.map((land) => (
                    <Dropdown.Item eventKey={land.id} value={land.id}>
                      {land.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="language-filter">
              <Dropdown onSelect={handleLanguageChange}>
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
        </div>

      </div>

      <br />

      <div className='drop-down-container' style={{ marginTop: "-25px" }}>

        <div className='landsectioncover'>
          <p className="landsection">
            <FaMapMarker style={{ marginRight: '5px' }} />
            Selected Land: {landName}
          </p>
        </div>

        <p className="home-heading">{t('workermanagement')}</p>

        <button className="add-worker-button" onClick={AddWorker}>
          {t('addworker')}
        </button>
      </div>
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

        {selectedLandId && selectedLandId !== ""
          ? filteredWorkersForSelectedLand.map((worker) => (

            <div key={worker.id} className="worker-card" onClick={() => handleWorkerCardClick(worker)}>
              <h3>{t('name')}: {worker.name}</h3>
              <p>{t('phone')}: {worker.phone}</p>
            </div>
          ))
          : filteredWorkers1.map((worker) => (
            <div key={worker.id} className="worker-card" onClick={() => handleWorkerCardClick(worker)}>
              <h3>{t('name')}: {worker.name}</h3>
              <p>{t('phone')}: {worker.phone}</p>
            </div>
          ))
        }
      </div>

      <br />

      {filteredWorkersForSelectedLand.length >= 4 && (
        <div>
          <button  className="load-more-button" onClick={handleLoadMore}>Load More <IoIosArrowDown /></button>
        </div>
      )}

      <br />
      <br />
      <br />
      <div className='footer-alignment'>
        <Footer />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
  setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageWorkers);