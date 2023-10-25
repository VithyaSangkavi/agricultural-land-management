import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import './manage-task.css'

const ManageTask = () => {

    const history = useHistory();
    const taskId = localStorage.getItem('TaskIDFromTaskAssigned')
    const startDate = localStorage.getItem('StartDate');
    const [taskName, setTaskName] = useState('');
    const [selectedView, setSelectedView] = useState('tasks');
    const [workerNames, setWorkerNames] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [selectedExpenseType, setSelectedExpenseType] = useState('');
    const [value, setValue] = useState('');
    const [expenseId, setExpenseId] = useState('');

    const [selectedWorkersList, setSelectedWorkersList] = useState([]);

    useEffect(() => {
        // console.log('Get task id from task assigned table : ', taskId);

        axios.get(`http://localhost:8081/service/master/findTaskNameById/?taskId=${taskId}`)
            .then((response) => {
                setTaskName(response.data.extra.taskName);
            })
            .catch((error) => {
                console.error('Error fetching task name:', error);
            });

        axios
            .post('http://localhost:8081/service/master/workerFindAll')
            .then((response) => {
                const workerNamesArray = response.data.extra.map((worker) => worker.name);
                setWorkerNames(workerNamesArray);
                //console.log(workerNames)
            })
            .catch((error) => {
                console.error('Error fetching worker names:', error);
            });

        axios
            .get('http://localhost:8081/service/master/expenseFindAll')
            .then((response) => {
                const expenseTypeArrays = response.data.extra.map((expense) => expense.expenseType);
                setExpenseTypes(expenseTypeArrays);
                //console.log(expenseTypes)
            })
            .catch((error) => {
                console.error('Error fetching worker names:', error);
            });
    })

    const handleAddSelectedWorker = () => {
        if (selectedWorker) {
            setSelectedWorkersList([...selectedWorkersList, selectedWorker]);
            setSelectedWorker('');
        }
    }

    const handleAddTaskExpense = () => {

        axios
        .get(`http://localhost:8081/service/master/find-by-type?expenseType=${selectedExpenseType}`)
        .then((response) => {
          const expenseId = response.data.expenseId;
          setExpenseId(expenseId); 
    
          const addTaskExpense = {
            value,
            taskId,
            expenseId,
          };
    
          axios.post('http://localhost:8081/service/master/task-expense-save', addTaskExpense)
            .then((response) => {
              console.log('Task expense added successfully:', response.data);
              history.push('/manageWorkers');
            })
            .catch((error) => {
              console.error('Error adding task expense:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching expense id:', error);
        });
    }

    return (
        <div className="manage-task-app-screen">
            <p className='main-heading'>Manage Task</p>
            <div className='task-heading'>
                <p> {taskName} task - </p>
                <p> From - {startDate} </p>
            </div>

            <div className="toggle-container">
                <button
                    onClick={() => setSelectedView('tasks')}
                    className={selectedView === 'tasks' ? 'active toggle-button' : 'toggle-button'}
                >
                    Tasks
                </button>
                <button
                    onClick={() => setSelectedView('finance')}
                    className={selectedView === 'finance' ? 'active toggle-button' : 'toggle-button'}
                >
                    Finance
                </button>
            </div>

            {/* Task Toggled View */}
            {selectedView === 'tasks' && (
                <div className='card'>
                    <p>Date - Ongoing</p><br />

                    <div className="dropdown-and-button-container">
                        <select
                            value={selectedWorker}
                            onChange={(e) => setSelectedWorker(e.target.value)}
                            className='dropdown-input'
                        >
                            <option value="">Select a worker</option>
                            {workerNames.map((workerName) => (
                                <option key={workerName} value={workerName}>
                                    {workerName}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleAddSelectedWorker}>Add</button>
                    </div>
                    {selectedWorkersList.length > 0 && (
                        <div>
                            <p>
                                {selectedWorkersList.map((worker, index) => (
                                    <p key={index}>{worker}</p>
                                ))}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Finance Toggled View */}
            {selectedView === 'finance' && (
                <div>
                    <select
                        value={selectedExpenseType}
                        onChange={(e) => setSelectedExpenseType(e.target.value)}
                        className='dropdown-input'
                    >
                        <option value="">Expense</option>
                        {expenseTypes.map((expenseType) => (
                            <option key={expenseType} value={expenseType}>
                                {expenseType}
                            </option>
                        ))}
                    </select><br />
                    <input
                        type="text"
                        placeholder="Amount"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="dropdown-input"
                    />
                    <button className="add-button" onClick={handleAddTaskExpense}>Add Task Expense</button>
                </div>
            )}
            <div className='footer-alignment'>
                <Footer />
            </div>
        </div>
    );
};

export default ManageTask;
