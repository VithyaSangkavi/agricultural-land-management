import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import './manage-expense-type.css';
import Footer from '../footer/footer';
import { FaGlobeAmericas } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Col, Form } from 'react-bootstrap';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';

function ManageExpenseTypes({ setSelectedLandId, selectedLandId }) {

  const { t, i18n } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [expense, setExpenseType] = useState([]);

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
    submitSets(submitCollection.manageexpense)
      .then((res) => {
        setExpenseType(res.extra);
      })
  }, []);

  const handleSelectLand = (eventKey) => {
    setSelectedLand(eventKey);

    axios.post(`http://localhost:8081/service/master/findLandIdByName?name=${eventKey}`)
      .then((response) => {
        const landIdWorker = response.data.extra;
        const thislandId = landIdWorker.landId;

        localStorage.setItem('selectedLandIdWorker', JSON.stringify(landIdWorker));

        setLandId(thislandId);

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredTasks = expense.filter((expense) =>
    expense.expenseType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const AddExpenseType = () => {
    history.push('/addExpenseType')
  }

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const goBack = () => {
    history.goBack(); 
  };

  return (
    <div className="expense-app-screen">
      <div className="header-bar">
        <MdArrowBackIos className="back-button" onClick={goBack}/>
        <p className="main-heading">{t('expensetypemanagement')}</p>
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
      </div>
      <div className='drop-down-container'>
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
        
        <br />
        <button className="add-expense-type-button" onClick={AddExpenseType}>
          {t('addexpensetype')}
        </button>
      </div>
      <br />
      <div>
        <input
          className='search-field'
          type="text"
          placeholder={t('searchexpensetypes')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      </div>

      <div className="expense-list">
        {filteredTasks.map((expense) => (
          <div key={expense.id} className="expense-card">
            <p>{expense.expenseType}</p>
          </div>
        ))}
        <br />
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => ({
  selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
  setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageExpenseTypes);
