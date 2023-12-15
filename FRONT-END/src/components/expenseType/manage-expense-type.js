import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './manage-expense-type.css';
import Footer from '../footer/footer';
import { FaGlobeAmericas, FaMapMarker } from 'react-icons/fa';
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
  const [landName, setLandName] = useState([]);

  const [selectedLand, setSelectedLand] = useState('');
  const [landId, setLandId] = useState('');

  const history = useHistory();

  const handleLandChange = (event) => {
    console.log("Land : ", event);
    setSelectedLandId(event);
  };

  useEffect(() => {
    submitSets(submitCollection.manageland, false).then((res) => {
      setLandNames(res.extra);
    });

    submitSets(submitCollection.getlandbyid, "?landId=" + selectedLandId, true).then((res) => {
      setLandName(res.extra.name);
    });

  }, [submitCollection.manageland, selectedLandId]);

  useEffect(() => {
    submitSets(submitCollection.manageexpense)
      .then((res) => {
        setExpenseType(res.extra);
      })
  }, []);

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

      <div className="drop-down-container" style={{marginTop: "-25px"}}>

        <div className='landsectioncover'>
          <p className="landsection">
            <FaMapMarker style={{ marginRight: '5px' }} />
            Selected Land: {landName}
          </p>
        </div>
        <p className="home-heading">{t('expensetypemanagement')}</p>

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
        <br /><br /><br />
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
