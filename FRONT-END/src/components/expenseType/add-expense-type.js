import React, { useState } from 'react';
import Axios from 'axios';
import './add-expense-type.css';
import Footer from '../footer/footer';
import { useHistory } from 'react-router-dom';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { MdArrowBackIos } from "react-icons/md";

const AddExpenseType = () => {

  const { t, i18n } = useTranslation();

  const history = useHistory();

  const [expenseType, setExpenseType] = useState('');

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

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const goBack = () => {
    history.goBack(); 
  };

  return (
    <>
      <div className="expense-app-screen">
        <div className="header-bar">
          <MdArrowBackIos className="back-button" onClick={goBack}/>

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

        <p className="home-heading">{t('addexpensetype')}</p>

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
            {t('add')}
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

export default AddExpenseType;
