import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './managetasktypes.css';
import Footer from '../footer/footer';
import { FaGlobeAmericas, FaSearch } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MdArrowBackIos } from "react-icons/md";
import { submitCollection } from '../../_services/submit.service';
import { Col, Form } from 'react-bootstrap';
import { submitSets } from '../UiComponents/SubmitSets';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';

function ManageTaskTypes({ setSelectedLandId, selectedLandId }) {

  const { t, i18n } = useTranslation();

  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [landNames, setLandNames] = useState([]);


  const history = useHistory();

  useEffect(() => {
    submitSets(submitCollection.manageland, false).then((res) => {
      setLandNames(res.extra);
    });
  }, [submitCollection.manageland]);

  const handleLandChange = (event) => {
    const newSelectedLandId = event.target.value;
    console.log(newSelectedLandId);
    setSelectedLandId(newSelectedLandId);
  };

  useEffect(() => {

    axios.post('http://localhost:8080/service/master/taskFindAll').then((response) => {
      setTasks(response.data.extra);
      console.log("Tasks : ", response.data.extra);
    });

    axios.get('http://localhost:8080/service/master/landFindAll').then((response) => {
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


  useEffect(() => {
    //get crop id by using landid
    axios.get(`http://localhost:8081/service/master/cropFindByLandId/${selectedLandId}`)
      .then((response) => {
        const cropIdLand = response.data.cropId.extra;
        localStorage.setItem('CropIdLand', cropIdLand);
        console.log('Crop API Response:', response.data);

        console.log('Crop ID From Land :', cropIdLand);

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedLandId]);

  const AddTaskType = () => {
    history.push('/addTaskType')
  }

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="task-app-screen">
      <div className='main-heading'>
        <div className="outer-frame d-flex justify-content-between">
          <MdArrowBackIos className="back-button" onClick={goBack} />
          <div className="land-filter">
            <Dropdown className='custom-dropdown'>
              <Col md={6}>
                <Form.Group>
                  <Form.Control as="select" value={selectedLandId} onChange={handleLandChange}>
                    {landNames.map((land) => (
                      <option key={land.id} value={land.id}>
                        {land.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Dropdown>
          </div>

          <div className="language-filter me-2">
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
      </div>

      <br />

      <div className='drop-down-container'>
        <p className="home-heading">{t('tasktypemanagement')}</p>


        <button className="add-task-type-button" onClick={AddTaskType}>
          {t('addtasktype')}
        </button>
      </div>
      <br />


      <div className="search-container">
        <div className="search-wrapper">
          <input
            className='search-field'
            type="text"
            placeholder={t('searchtasktypes')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-icon">
            <FaSearch />
          </div>
        </div>
      </div>

      <div className="task-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-card">
            <p>{task.taskName}</p>
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

const mapStateToProps = (state) => ({
  selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
  setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTaskTypes);
