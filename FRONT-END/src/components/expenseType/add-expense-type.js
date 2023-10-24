import React, { useState } from 'react';
import Axios from 'axios';
import './add-expense-type.css';
import Footer from '../footer/footer';
import {useHistory} from 'react-router-dom';

const AddExpenseType = () => {
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

  return (
    <>
    <div className="expense-app-screen">
      <p className='main-heading'>Add Expense Type</p>
          <div className="basic-details">
            <input
              type="text"
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value)}
              placeholder="Expense Type"
              className="input-field"
            />
            <br/>
            <button className="add-button" onClick={handleAddExpense}>
              Add
            </button>
          </div>
          <div className='footer-alignment'>
        <Footer />
      </div>
    </div>
    </>
  );
};

export default AddExpenseType;
