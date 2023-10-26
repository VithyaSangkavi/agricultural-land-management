import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import './manage-task.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


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
    const [kgValues, setKgValues] = useState('');
    //const [workerId, setWorkerId] = useState('');
    const taskAssignedId = 1;
    const lotId = 1;
    const [quantity, setQuantity] = useState('');

    const [workers, setWorkers] = useState([]);


    // useEffect(() => {
    //     // console.log('Get task id from task assigned table : ', taskId);

    //     axios.get(`http://localhost:8081/service/master/findTaskNameById/?taskId=${taskId}`)
    //         .then((response) => {
    //             setTaskName(response.data.extra.taskName);
    //         })
    //         .catch((error) => {
    //             //console.error('Error fetching task name:', error);
    //         });

    //     axios
    //         .post('http://localhost:8081/service/master/workerFindAll')
    //         .then((response) => {
    //             const workerNamesArray = response.data.extra.map((worker) => worker.name);
    //             setWorkerNames(workerNamesArray);
    //             //console.log(workerNames)
    //         })
    //         .catch((error) => {
    //             //console.error('Error fetching worker names:', error);
    //         });

    //     axios
    //         .get('http://localhost:8081/service/master/expenseFindAll')
    //         .then((response) => {
    //             const expenseTypeArrays = response.data.extra.map((expense) => expense.expenseType);
    //             setExpenseTypes(expenseTypeArrays);
    //             //console.log(expenseTypes)
    //         })
    //         .catch((error) => {
    //            // console.error('Error fetching worker names:', error);
    //         });
    // })

    const fetchTaskName = () => {
        axios.get(`http://localhost:8081/service/master/findTaskNameById/?taskId=${taskId}`)
            .then((response) => {
                setTaskName(response.data.extra.taskName);
            })
            .catch((error) => {
                // Handle error
            });
    };

    const fetchWorkerNames = () => {
        axios.post('http://localhost:8081/service/master/workerFindAll')
            .then((response) => {
                const workerNamesArray = response.data.extra.map((worker) => worker.name);
                setWorkerNames(workerNamesArray);
            })
            .catch((error) => {
                // Handle error
            });
    };

    const fetchExpenseTypes = () => {
        axios.get('http://localhost:8081/service/master/expenseFindAll')
            .then((response) => {
                const expenseTypeArrays = response.data.extra.map((expense) => expense.expenseType);
                setExpenseTypes(expenseTypeArrays);
            })
            .catch((error) => {
                // Handle error
            });
    };

    useEffect(() => {
        fetchTaskName();
        fetchWorkerNames();
        fetchExpenseTypes();
    }, []);

    const handleAddSelectedWorker = () => {

        if (taskName === 'Pluck') {
            console.log('Pluck task')
            if (selectedWorker) {
                setSelectedWorkersList([...selectedWorkersList, selectedWorker]);
                setSelectedWorker('');
                console.log('selected worker: ', selectedWorker);
                localStorage.setItem('selectedWorker', selectedWorker);
            }
        } else {
            if (selectedWorker) {
                setSelectedWorkersList([...selectedWorkersList, selectedWorker]);
                setSelectedWorker('');
                console.log('selected worker: ', selectedWorker);

                axios.post(`http://localhost:8081/service/master/findWorkerIdByName?name=${selectedWorker}`)
                    .then((response) => {
                        const workerId = response.data.extra.workerId
                        // setWorkerId(storeWorkerId);
                        console.log('Worker ID :', workerId);

                        const addWorkAssigned = {
                            startDate,
                            workerId,
                            taskId,
                            taskAssignedId,
                            lotId
                        }

                        axios.post('http://localhost:8081/service/master/work-assigned-save', addWorkAssigned)
                            .then((response) => {
                                console.log('Work assigned added successfully:', response.data);

                            })
                            .catch((error) => {
                                console.error('Error adding work assigned:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error getting worker id:', error);
                    });
            }

        }

    }

    // add task expense
    const handleAddTaskExpense = () => {

        //get expense id according to the expense type
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

                //save task expense 
                axios.post('http://localhost:8081/service/master/task-expense-save', addTaskExpense)
                    .then((response) => {
                        console.log('Task expense added successfully:', response.data);
                        history.push('/home');
                    })
                    .catch((error) => {
                        // console.error('Error adding task expense:', error);
                    });
            })
            .catch((error) => {
                //console.error('Error fetching expense id:', error);
            });
    }

    const handleKgChange = (e, index) => {
        const updatedKgValues = [...kgValues];
        updatedKgValues[index] = e.target.value;
        setKgValues(updatedKgValues);
        setQuantity(updatedKgValues);
    };

    const addQuantity = () => {

        const selectedWorker = localStorage.getItem('selectedWorker');
        console.log('selected worker: ', selectedWorker);

        axios.post(`http://localhost:8081/service/master/findWorkerIdByName?name=${selectedWorker}`)
            .then((response) => {
                const workerId = response.data.extra.workerId
                // setWorkerId(storeWorkerId);
                console.log('Worker ID :', workerId);

                const addWorkAssigned = {
                    quantity,
                    startDate,
                    workerId,
                    taskId,
                    taskAssignedId,
                    lotId
                }

                axios.post('http://localhost:8081/service/master/work-assigned-save', addWorkAssigned)
                    .then((response) => {
                        console.log('Work assigned added successfully:', response.data);

                    })
                    .catch((error) => {
                        console.error('Error adding work assigned:', error);
                    });
            })
            .catch((error) => {
                console.error('Error getting worker id:', error);
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
                                <option key={workers.name} value={workerName}>
                                    {workerName}
                                </option>
                            ))}
                        </select>
                        <button className='add-small' onClick={handleAddSelectedWorker}>Add</button>
                    </div>
                    {selectedWorkersList.length > 0 && (
                        <div>
                            {selectedWorkersList.map((worker, index) => (
                                <div key={index} className="worker-container">
                                    <p>{worker}</p>
                                    {taskName === 'Pluck' && (
                                        <div className="kg-input-container">
                                            <div className="kg-input">
                                                <input
                                                    type="text"
                                                    placeholder="Number of kg"
                                                    value={kgValues[index] || ''}
                                                    onChange={(e) => handleKgChange(e, index)}
                                                    className="dropdown-input"
                                                />
                                                <span className="add-kg-icon">
                                                    <FontAwesomeIcon icon={faPlus} onClick={addQuantity} />
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button className="add-button">Assign Work</button>
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
