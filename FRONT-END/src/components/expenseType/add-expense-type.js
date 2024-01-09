import { useState, useEffect } from 'react';
import './add-expense-type.css';
import Footer from '../footer/footer';
import Header from '../header/header';
import { useHistory } from 'react-router-dom';
import { FaGlobeAmericas, FaLanguage, FaMapMarker } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';

const AddExpenseType = ({ setSelectedLandId, selectedLandId }) => {

  const { t, i18n } = useTranslation();

  const history = useHistory();

  const [expenseType, setExpenseType] = useState('');
  const [landNames, setLandNames] = useState([]);
  const [landName, setLandName] = useState([]);

  //add task type
  const handleAddExpense = () => {
    const addExpense = {
      expenseType
    };

    submitSets(submitCollection.saveexpense, addExpense, false)
      .then(res => {
        if (res && res.status) {
          alertService.success("Expense type added successfully")
          history.push('/manageExpenseType')
        } else {
          alertService.error("Error adding expense type")
        }
      })
  };

  useEffect(() => {
    submitSets(submitCollection.getlandbyid, "?landId=" + selectedLandId, true).then((res) => {
      setLandName(res.extra.name);
    });

  }, [submitCollection.manageland, selectedLandId]);

  return (
    <>
      <div className="expense-app-screen">
       <Header/>

        <div className="drop-down-container">

          <div className='landsectioncover'>
            <p className="landsection">
              <FaMapMarker style={{ marginRight: '5px' }} />
              Selected Land: {landName}
            </p>
          </div>
          {/* <p className="home-heading">{t('addexpensetype')}</p> */}
        </div>

        <div className="basic-details">
          <input
            type="text"
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
            placeholder={t('expensetype')}
            className="input-field"
          />
          <br />
          <button className="add-button" onClick={handleAddExpense}>
            {t('addexpensetype')}
          </button>
        </div>
        <br /> <br /> <br />
        <div className='footer-alignment'>
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
  setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddExpenseType);
