import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './manage-expense-type.css';
import Footer from '../footer/footer';
import { FaGlobeAmericas, FaLanguage, FaSearch } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { MdArrowBackIos } from "react-icons/md";

function ManageExpenseTypes() {

  const { t, i18n } = useTranslation();

  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [expense, setExpenseType] = useState([]);

  const [landId, setLandId] = useState();

  const history = useHistory();

  useEffect(() => {
    submitSets(submitCollection.manageexpense)
      .then((res) => {
        setExpenseType(res.extra);
      })

    submitSets(submitCollection.manageland)
      .then((res) => {
        setLands(res.extra);
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

  return (
    <div className="expense-app-screen">
      <div className="header-bar">
        <MdArrowBackIos className="back-button" />
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
        <Dropdown onSelect={handleSelectLand} className='custom-dropdown'>
          <Dropdown.Toggle className='drop-down' id="dropdown-land">
            {selectedLand || t('selectland')}
          </Dropdown.Toggle>
          <Dropdown.Menu className='drop-down-menu'>
            {lands.map((land) => (
              <div key={land.id}>
                <Dropdown.Item eventKey={land.name}>{land.name}</Dropdown.Item>
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <br />
        <button className="add-expense-type-button" onClick={AddExpenseType}>
          {t('addexpensetype')}
        </button>
      </div>
      <br />

      <div className="search-container">
        <div className="search-wrapper">
          <input
            className='search-field'
            type="text"
            placeholder={t('searchexpensetypes')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-icon">
            <FaSearch />
          </div>
        </div>
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

export default ManageExpenseTypes;
