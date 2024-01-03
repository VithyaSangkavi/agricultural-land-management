import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import tea from '../../assets/img/crop_images/tea.png';
import wheat from '../../assets/img/crop_images/wheat.png';
import coconut from '../../assets/img/crop_images/coconut.png';
import './home.css';
import '../css/common.css';
import Footer from '../footer/footer';
import Header from '../header/header';
import { FaGlobeAmericas } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaMapMarker } from 'react-icons/fa';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { setSelectedCropAction } from '../../actions/auth/crop_action';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Col, Form } from 'react-bootstrap';
import '../css/common.css';
import { alertService } from '../../_services/alert.service';
import { useSelector } from 'react-redux';

function Home({ setSelectedLandId, selectedLandId, setSelectedCropName, selectedCropName }) {
    const [t, i18n] = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');

    const [query, setQuery] = useState('');
    const [task, setTask] = useState([]);
    const [taskAssigned, setTaskAssigned] = useState([]);
    const [OngoingTasks, setOngoingTasks] = useState([]);
    const [landNames, setLandNames] = useState([]);
    const [landName, setLandName] = useState([]);
    const [cropName, setCropName] = useState('');

    let selectedImage = null;

    const history = useHistory();

    const cropNameFromRedux = useSelector((state) => state.selectedCropName);

    const actualCropName = cropNameFromRedux ? cropNameFromRedux.cropName : '';

    console.log('Crop Name from Redux:', actualCropName);

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    };

    console.log("selected land : ", selectedLandId)


    useEffect(() => {
        axios.post('http://localhost:8081/service/master/taskAssignedFindAll').then((response) => {
            setTaskAssigned(response.data);
            console.log("Task Assigned: ", response.data);
        });

        axios.post('http://localhost:8081/service/master/taskFindAll').then((response) => {
            setTask(response.data.extra);
            console.log("Tasks : ", response.data.extra);
        });

        axios.get(`http://localhost:8081/service/master/ongoing-tasks-with-names?landId=${selectedLandId}`).then((response) => {
            setOngoingTasks(response.data.extra);
            console.log("Ongoing tasks : ", response.data);

            if (response.data.extra.length === 0) {
                alertService.info('No Data Found !');
            }
        });

        axios.get(`http://localhost:8081/service/master/cropNameFindByLandId/${selectedLandId}`)
            .then((response) => {
                setCropName(response.data.cropName.extra);
                setSelectedCropName(response.data.cropName.extra);
                console.log('crop name: ', cropName);

            })
            .catch((error) => {
                console.error('Error fetching task card id:', error);
            });

    }, [selectedLandId]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const filteredTasks = task.filter((task) =>
        task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // const handleLandChange = (event) => {
    //     console.log("Land : ", event);
    //     setSelectedLandId(event);
    // };


    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });

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

    // const handleLandChange = (event) => {
    //     const newSelectedLandId = event.target.value;
    //     console.log(newSelectedLandId);
    //     setSelectedLandId(newSelectedLandId);

    //     axios.post(`http://localhost:8081/service/master/findLandIdByName?name=${selectedLandId}`)
    //         .then((response) => {
    //             const landIdTask = response.data.extra;
    //             const taskLand = JSON.stringify(landIdTask);
    //             const landData = JSON.parse(taskLand);
    //             const landId = landData.landId;
               
    //             console.log('Selected Land Id :', landId);
    //             localStorage.setItem('SelectedLandId', landId);

    //             console.log("selected land : ", selectedLandId)
    //             console.log("landId : ", landId)
    //             axios.get(`http://localhost:8081/service/master/ongoing-tasks-with-names?landId=${selectedLandId}`).then((response) => {
    //                 setOngoingTasks(response.data.extra);
    //                 console.log("Ongoing tasks : ", response.data.extra);

    //             });
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching data:", error);
    //         });
    // }


    const handleChange = (event) => {
        setQuery(event.target.value);
    };
    const filteredTaskAssigned = Array.isArray(taskAssigned)
        ? taskAssigned.filter((task) => task.taskAssignedId)
        : [];

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };
    const handleTaskClick = (taskAssignedid) => {
        history.push(`/manageOngoingTask/${taskAssignedid}`);
        console.log("task assigned : ", taskAssignedid);
    };

    return (
        <div className="home-app-screen">
            <Header />

            <div className="drop-down-container">

                <div className='landsectioncover'>
                    <p className="landsection">
                        <FaMapMarker style={{ marginRight: '5px' }} />
                        Selected Land: {landName}
                    </p>
                </div>

                <div className='home-heading'>
                    <p>{t('ongoingtasks')}</p>
                </div>

            </div>

            <div className="task-list">
                {OngoingTasks.map((taskAssigned) => (
                    <div key={taskAssigned.id} className="task-card" onClick={() => handleTaskClick(taskAssigned.taskAssignedId)}>
                        <p>{taskAssigned.taskName} - {getFormattedDate(taskAssigned.taskStartDate)}</p>
                    </div>
                ))}
            </div>

            < br />
            <button className="float-new-task-button" onClick={() => history.push('/homeNewTasks')} title="Assign new task">
                <FaPlus />
            </button>
            <br />
            < br />
            <Footer />
        </div>
    );
}

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
    selectedCropName: state.SelectedCropName
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
    setSelectedCropName: setSelectedCropAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);