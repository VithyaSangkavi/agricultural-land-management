import React, { useState } from 'react';
import Axios from 'axios';
import './add-expense-type.css';
import Footer from '../footer/footer';
import { useHistory } from 'react-router-dom';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const AddExpenseType = () => {

  const { t, i18n } = useTranslation();

  const history = useHistory();

  const [expenseType, setExpenseType] = useState('');

  //add task type
  const handleAddExpense = () => {
    const addExpense = {
      expenseType
    };

    Axios.post('http://localhost:8081/service/master/expenseSave', addExpense)
      .then((response) => {
        console.log('Expense type added successfully:', response.data);
        history.push('/manageExpenseType');
      })
      .catch((error) => {
        console.error('Error adding expense type:', error);
      });
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <div className="expense-app-screen">
        <p className='main-heading'>{t('addexpensetype')}</p>
        <div className="position-absolute top-0 end-0 mt-2 me-2">
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
