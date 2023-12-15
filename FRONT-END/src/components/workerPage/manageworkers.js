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


function ManageWorkers({ setSelectedLandId, selectedLandId }) {

  const { t, i18n } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState([]);
  const [filteredWorkersForSelectedLand, setFilteredWorkersForSelectedLand] = useState([]);

  const [landNames, setLandNames] = useState([]);
  const [landName, setLandName] = useState([]);

  const history = useHistory();

  useEffect(() => {

    axios.post('http://localhost:8080/service/master/workerFindAll').then((response) => {
      setWorkers(response.data.extra);
      console.log("Workers : ", response.data.extra);
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

    submitSets(submitCollection.getlandbyid, "?landId=" + selectedLandId, true).then((res) => {
      setLandName(res.extra.name);
    });

  }, [submitCollection.manageland, selectedLandId]);

  const handleLandChange = (event) => {
    console.log("Land : ", event);
    setSelectedLandId(event);
  };


  useEffect(() => {
    axios.get(`http://localhost:8080/service/master/findByLandId?landId=${selectedLandId}`)
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
  }, [selectedLandId]);



  const handleWorkerCardClick = (worker) => {
    history.push('/addWorker', { basicDetails: worker });
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const goBack = () => {
    history.goBack();
  };

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