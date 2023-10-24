import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './manage-expense-type.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Footer from '../footer/footer';

function ManageExpenseTypes() {

  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [expense, setExpenseType] = useState([]);

  const history = useHistory();

  useEffect(() => {

    axios.get('http://localhost:8081/service/master/expenseFindAll').then((response) => {
      setExpenseType(response.data.extra);
      console.log("Expenses : ", response.data.extra);
    });

    axios.get('http://localhost:8081/service/master/landFindAll').then((response) => {
      setLands(response.data.extra);
      console.log("Lands : ", response.data.extra);
    });
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

  return (
    <div className="expense-app-screen">
      <p className='main-heading'>Task Management</p>
      <div className='drop-down-container'>
        <Dropdown className='custom-dropdown'>
          <Dropdown.Toggle className='drop-down' id="dropdown-land">
            {selectedLand || 'Select Land'}
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
          Add Expense Type
        </button>
      </div>
      <div>
        <input
          className='search-field'
          type="text"
          placeholder="Search Expense Types"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="expense-list">
        {filteredTasks.map((expense) => (
          <div key={expense.id} className="expense-card">
            <p>Expense Type: {expense.expenseType}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default ManageExpenseTypes;
