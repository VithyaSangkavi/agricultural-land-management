import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import Header from '../header/header';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import './manage-task.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MultiDatePicker from "react-multi-date-picker";
import { useLocation } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { Trash } from 'react-bootstrap-icons';
import { alertService } from '../../_services/alert.service';
import { IoMdClose } from "react-icons/io";
import { submitSets } from '../UiComponents/SubmitSets';
import { submitCollection } from '../../_services/submit.service';


const ManageTask = ({ selectedLandId }) => {

    const location = useLocation();
    const { selectedDates } = location.state || {};
    const { taskAssignedId } = location.state || {};

    const [formattedDates, setFormattedDates] = useState([]);
    const [currentDate, setCurrentDate] = useState(Array(selectedDates.length).fill(''));

    const [t, i18n] = useTranslation();

    const history = useHistory();

    const taskId = localStorage.getItem('TaskIDFromTaskAssigned')
    const startDate = localStorage.getItem('StartDate');
    const [taskName, setTaskName] = useState('');
    const [selectedView, setSelectedView] = useState('tasks');
    const [workerNames, setWorkerNames] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState(Array(selectedDates.length).fill(''));
    const [selectedWorkersLists, setSelectedWorkersLists] = useState(Array(selectedDates.length).fill([]));
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [selectedExpenseType, setSelectedExpenseType] = useState('');
    const [value, setValue] = useState('');
    const [expenseId, setExpenseId] = useState('');
    const [selectedWorkersList, setSelectedWorkersList] = useState([]);
    const [kgValues, setKgValues] = useState('');
    const [lotId, setLotId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [taskCardId, setTaskCardId] = useState('');
    const thisid = localStorage.getItem('taskassignedid')
    const [workers, setWorkers] = useState([]);
    const [quantityInputs, setQuantityInputs] = useState(Array(selectedDates.length).fill(''));
    const [addedWorkersData, setAddedWorkersData] = useState([]);
    const [addedWorkersList, setWorkerList] = useState([]);
    const [addedWorkerDetails, setAddedWorkerDetails] = useState([]);


    console.log("Selected Dates : ", selectedDates)

    useEffect(() => {
        const formattedDatesArray = selectedDates.map(dateObject => {
            const year = dateObject.year;
            const month = dateObject.month.index + 1;
            const day = dateObject.day;
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            return formattedDate;
        });

        setFormattedDates(formattedDatesArray);
        setCurrentDate(formattedDatesArray);
    }, [selectedDates]);


    console.log("Formatted date page 02: ", formattedDates)

    const taskAssignedDate = startDate;

    useEffect(() => {
        fetchTaskName();
        fetchWorkerNames();
        fetchExpenseTypes();
        fetchLotId();
        console.log('check task assigned id: ', thisid);
    }, []);

    const fetchTaskName = () => {
        submitSets(submitCollection.findTaskNameById, '/?taskId=' + taskId)

            .then((response) => {
                setTaskName(response.extra.taskName);

            })
            .catch((error) => {
                //console.error('Error fetching task name:', error);
            });
    };


    const fetchWorkerNames = () => {
        // axios.get(`http://localhost:8081/service/master/findByLandId?landId=${selectedLandId}`)
        submitSets(submitCollection.findByLandId, '?landId=' + selectedLandId)
            .then((response) => {
                const workerNamesArray = response.extra.map((worker) => worker.name);
                setWorkerNames(workerNamesArray);
            })
            .catch((error) => {
                //console.error('Error fetching worker names:', error);
            });
    };

    const fetchExpenseTypes = () => {
        // axios.get('http://localhost:8081/service/master/expenseFindAll')
        submitSets(submitCollection.manageexpense, true)
            .then((response) => {
                const expenseTypeArrays = response.extra.map((expense) => expense.expenseType);
                setExpenseTypes(expenseTypeArrays);
            })
            .catch((error) => {
                // console.error('Error fetching expenses:', error);
            });
    };

    const fetchLotId = () => {
        // axios.get(`http://localhost:8081/service/master/findLotByLandId?landId=${selectedLandId}`)
        submitSets(submitCollection.findLotByLandId, '?landId=' + selectedLandId, true)


            .then((response) => {
                const thislot = response.extra.id;
                console.log('Lot id: ', response.extra.id)
                setLotId(thislot);
            })
            .catch((error) => {
                console.error('Error fetching lot id:', error);
            });
    }


    // add task expense
    const handleAddTaskExpense = () => {

        //get expense id according to the expense type
        
            // axios.get(`http://localhost:8081/service/master/find-by-type?expenseType=${selectedExpenseType}`)
            submitSets(submitCollection.find_by_type, '?expenseType=' + selectedExpenseType, true)
            .then((response) => {
                const expenseId = response.expenseId;
                setExpenseId(expenseId);

                const addTaskExpense = {
                    value,
                    taskId,
                    expenseId,
                };

                //save task expense 
                // axios.post('http://localhost:8081/service/master/task-expense-save', addTaskExpense)
                submitSets(submitCollection.task_expense_save, addTaskExpense, true)
                    .then((response) => {
                        console.log('Task expense added successfully:', response);
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



    const addQuantity = () => {

        const selectedWorker = localStorage.getItem('selectedWorker');
        console.log('selected worker: ', selectedWorker);

        if (!taskCardId) {
            const saveTaskCard = {
                taskAssignedDate,
                taskAssignedId,
            };

            // axios.post('http://localhost:8081/service/master/task-card-save', saveTaskCard)
            submitSets(submitCollection.task_card_save, saveTaskCard, true)
                .then((response) => {
                    console.log('Task card added', response);
                    localStorage.setItem('taskassignedid', taskAssignedId);

                    // axios.get(`http://localhost:8081/service/master/taskCardFindById?taskAssignedId=${taskAssignedId}`)
                    submitSets(submitCollection.taskCardFindById, '?taskAssignedId=' + taskAssignedId, true)
                        .then((response) => {
                            const taskCardId = response.extra.id;

                            console.log('Task card id: ', taskCardId);
                            setTaskCardId(taskCardId);

                            addWorkerToTaskCard(taskCardId);
                        })
                        .catch((error) => {
                            console.error('Error fetching task card id:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error adding task card:', error);
                });
        } else {
            addWorkerToTaskCard(taskCardId);
        }

    }

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const handleTaskCard = () => {
        const saveTaskCard = {
            taskAssignedDate,
            taskAssignedId
        }

        // axios.post('http://localhost:8081/service/master/task-card-save', saveTaskCard)
        submitSets(submitCollection.task_card_save, saveTaskCard, true)
            .then((response) => {
                console.log('task card added', response)
            })
            .catch((error) => {
                console.error('Error adding task card:', error);
            });
    }


    const goBack = () => {
        history.goBack();
    };


    const handleKgChange = (e, index) => {
        const updatedKgValues = [...kgValues];
        updatedKgValues[index] = e.target.value;
        setKgValues(updatedKgValues);
        setQuantity(updatedKgValues);
    };

    const handleAddSelectedWorker = (dateIndex) => {
        const selectedWorkerName = selectedWorker[dateIndex];
        const quantity = quantityInputs[dateIndex] !== '' ? quantityInputs[dateIndex] : null;

        console.log('adding worker', selectedWorkersLists)

        // Check if the worker has already been added for this date
        if (selectedWorkersLists[dateIndex].includes(selectedWorkerName)) {
            // Display a warning or handle the duplicate entry as needed
            alertService.warn('Worker has already been added for this date.');
            return;
        }

        // Check if quantity is required for the task
        if (taskName === 'Pluck' && selectedWorkerName && quantity === null) {
            // Display a warning for missing quantity
            alertService.warn('Quantity is required for Pluck task.');
            return;
        }

        // Save task card and worker
        saveTaskCardAndWorker(dateIndex, selectedWorkerName, quantity);

        // Reset the input after using it
        const newQuantityInputs = [...quantityInputs];
        newQuantityInputs[dateIndex] = '';
        setQuantityInputs(newQuantityInputs);

        // Update selected workers list
        const updatedSelectedWorkersLists = [...selectedWorkersLists];
        updatedSelectedWorkersLists[dateIndex] = [...selectedWorkersLists[dateIndex], selectedWorkerName];
        setSelectedWorkersLists(updatedSelectedWorkersLists);

        // Update added worker data
        const newAddedWorkerData = {
            date: currentDate[dateIndex],
            worker: selectedWorkerName,
            quantity,
        };
        setAddedWorkersData([...addedWorkersData, newAddedWorkerData]);
    };



    const saveTaskCardAndWorker = (dateIndex, selectedWorker, quantity) => {
        localStorage.setItem('selectedWorker', selectedWorker);

        if (!taskCardId[dateIndex]) {
            const saveTaskCard = {
                taskAssignedDate,
                taskAssignedId,
                workDate: currentDate[dateIndex]
            };

            // axios.post('http://localhost:8081/service/master/task-card-save', saveTaskCard)
            submitSets(submitCollection.task_card_save, saveTaskCard, true)
                .then((response) => {
                    console.log('Task card added', response);
                    const newTaskCardId = response.extra.id;

                    const updatedTaskCardIds = [...taskCardId];
                    updatedTaskCardIds[dateIndex] = newTaskCardId;
                    setTaskCardId(updatedTaskCardIds);

                    addWorkerToTaskCard(newTaskCardId, selectedWorker, quantity, dateIndex);
                })
                .catch((error) => {
                    console.error('Error adding task card:', error);
                });
        } else {
            addWorkerToTaskCard(taskCardId[dateIndex], selectedWorker, quantity, dateIndex);
        }
    };

    const addWorkerToTaskCard = (taskCardId, selectedWorker, quantity, dateIndex) => {
        axios.post(`http://localhost:8081/service/master/findWorkerIdByName?name=${selectedWorker}`)
        // submitSets(submitCollection.findWorkerIdByName, '?name=' + selectedWorker, true)

            .then((response) => {
                const workerId = response.data.extra.workerId;
                console.log('Worker ID:', workerId);

                const addWorkAssigned = {
                    quantity,
                    startDate,
                    workerId,
                    taskId: taskId,
                    taskAssignedId,
                    lotId: 1,
                    taskCardId: taskCardId,
                };

                // axios.post('http://localhost:8081/service/master/work-assigned-save', addWorkAssigned)
                submitSets(submitCollection.work_assigned_save, addWorkAssigned, true)
                    .then((response) => {
                        console.log('Work assigned added successfully:', response.extra);
                        setAddedWorkerDetails(response.extra)

                        const newWorkerList = {
                            date: currentDate[dateIndex],
                            id: response.extra.id,
                            worker: response.extra.name,
                            quantity: response.extra.quantity,
                        };
                        setWorkerList([...addedWorkersList, newWorkerList]);
                    })
                    .catch((error) => {
                        console.error('Error adding work assigned:', error);
                    });
            })
            .catch((error) => {
                console.error('Error getting worker id:', error);
            });
    };

    const deleteWorkAssigned = (workAssignedId, dateIndex, workerName) => {

        console.log('date index:', dateIndex)
        console.log('date index:', workerName)

        axios.delete(`http://localhost:8081/service/master/work-assigned-delete/${workAssignedId}`)
        // submitSets(submitCollection.work_assigned_delete, "/" + workAssignedId, true)
            .then(response => {
                console.log('Worker removed successfully:', response);

                // Update state to remove the deleted item
                setWorkerList(prevList => prevList.filter(item => item.id !== workAssignedId));

                // Update selectedWorkersLists to remove the workerName from the corresponding array
                setSelectedWorkersLists(prevLists => {
                    const updatedLists = [...prevLists];
                    updatedLists[dateIndex] = updatedLists[dateIndex].filter(name => name !== workerName);
                    return updatedLists;
                });

                console.log(selectedWorkersLists)

            })
            .catch(error => {
                console.error('Error removing worker:', error);
            });
    };

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const options = {
            year: 'numeric',
            month: 'long',
            weekday: 'long',
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const daySuffix = getDaySuffix(day);

        return `${day}${daySuffix} ${formattedDate}`;
    };

    const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        const lastDigit = day % 10;
        switch (lastDigit) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };


    return (
        <div className="manage-task-app-screen">
            <Header/>
            <div className='task-heading'>
                <p> {taskName} {t('task')}  </p>
                <p> {t('from')} - {getFormattedDate(startDate)} </p>
            </div>
            <br />
            <div className="toggle-container">
                <button
                    onClick={() => setSelectedView('tasks')}
                    className={selectedView === 'tasks' ? 'active toggle-button' : 'toggle-button'}
                >
                    {t('tasks')}
                </button>
                <button
                    onClick={() => setSelectedView('finance')}
                    className={selectedView === 'finance' ? 'active toggle-button' : 'toggle-button'}
                >
                    {t('finance')}
                </button>
            </div>

            {/* Task Toggled View */}

            <>
                {selectedDates.map((date, dateIndex) => (
                    <div key={dateIndex}>
                        {selectedView === 'tasks' && (
                            <div className='card'>
                                <p>{t('date')}: {formattedDates[dateIndex]}</p><br />

                                <div className="dropdown-and-button-container">
                                    <select
                                        value={selectedWorker[dateIndex]}
                                        onChange={(e) => {
                                            const newSelectedWorkers = [...selectedWorker];
                                            newSelectedWorkers[dateIndex] = e.target.value;
                                            setSelectedWorker(newSelectedWorkers);
                                        }}
                                        className='dropdown-input'
                                        style={{ height: '40px', border: '1px solid' }}
                                    >
                                        <option value="">{t('selectaworker')}</option>
                                        {workerNames.map((workerName, index) => (
                                            <option key={index} value={workerName}>
                                                {workerName}
                                            </option>
                                        ))}
                                    </select>

                                    {taskName === 'Pluck' && (
                                        <input
                                            type="text"
                                            value={quantityInputs[dateIndex]}
                                            onChange={(e) => {
                                                const newQuantityInputs = [...quantityInputs];
                                                newQuantityInputs[dateIndex] = e.target.value;
                                                setQuantityInputs(newQuantityInputs);
                                            }}
                                            placeholder={`Qty.`}
                                            className='quantity-input'
                                            style={{ width: '100px', height: '40px' }}
                                        />
                                    )}
                                    <button
                                        className='add-small'
                                        style={{ height: '40px' }}
                                        onClick={() => handleAddSelectedWorker(dateIndex)}>{t('add')}
                                    </button>

                                </div>

                                <div className='worker-container'>
                                    {addedWorkersList.map((addedData, index) => {
                                        if (taskName === 'Pluck') {
                                            if (addedData.date === currentDate[dateIndex]) {
                                                return (
                                                    <div key={index} className='line'>

                                                        <div className='line-two'>
                                                            <p>{addedData.worker} - {addedData.quantity}kg</p>
                                                            <button onClick={() => deleteWorkAssigned(addedData.id, dateIndex, addedData.worker)}>
                                                                <IoMdClose />
                                                            </button>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        } else {
                                            if (addedData.date === currentDate[dateIndex]) {
                                                return (
                                                    <div key={index} className='line'>
                                                        <div className='line-two'>
                                                            <p>{addedData.worker}</p>
                                                            <button onClick={() => deleteWorkAssigned(addedData.id, dateIndex, addedData.worker)}>
                                                                <IoMdClose />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }
                                        return null;
                                    })}
                                </div>


                            </div>
                        )}
                    </div>
                ))}
            </>



            {/* Finance Toggled View */}
            {selectedView === 'finance' && (
                <div>
                    <select
                        value={selectedExpenseType}
                        onChange={(e) => setSelectedExpenseType(e.target.value)}
                        className='dropdown-input'
                    >
                        <option value="">{t('expense')}</option>
                        {expenseTypes.map((expenseType) => (
                            <option key={expenseType} value={expenseType}>
                                {expenseType}
                            </option>
                        ))}
                    </select><br />
                    <input
                        type="text"
                        placeholder={t('amount')}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="dropdown-input"
                    />
                    <button className="add-button" onClick={handleAddTaskExpense}>{t('addtaskexpense')}</button>
                </div>
            )}
            <br /><br /><br />

            <div className='footer-alignment'>
                <Footer />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTask);