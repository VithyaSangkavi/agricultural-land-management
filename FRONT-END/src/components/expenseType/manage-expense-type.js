import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './manage-expense-type.css';
import Footer from '../footer/footer';
import Header from '../header/header';
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

  useEffect(() => {
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
      <Header/>
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
