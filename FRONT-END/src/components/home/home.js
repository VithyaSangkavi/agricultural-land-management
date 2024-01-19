import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import './home.css';
import '../css/common.css';
import Footer from '../footer/footer';
import Header from '../header/header';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaMapMarker } from 'react-icons/fa';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { setSelectedCropAction } from '../../actions/auth/crop_action';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import '../css/common.css';
import { alertService } from '../../_services/alert.service';

function Home({ setSelectedLandId, selectedLandId, selectedCrop }) {
    const [t, i18n] = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');

    const [query, setQuery] = useState('');
    const [task, setTask] = useState([]);
    const [taskAssigned, setTaskAssigned] = useState([]);
    const [OngoingTasks, setOngoingTasks] = useState([]);
    const [landNames, setLandNames] = useState([]);
    const [landName, setLandName] = useState([]);
    const history = useHistory();

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    };

    console.log("selected land : ", selectedLandId)
    console.log('selected crop: ', selectedCrop)


    useEffect(() => {
        
        submitSets(submitCollection.taskAssignedFindAll, false).then((response) => {
            setTaskAssigned(response);
            console.log("Task Assigned: ", response);
        });

        submitSets(submitCollection.taskFindAll, false).then((response) => {

            console.log(response.extra)
            setTask(response.extra);
            console.log("Tasks : ", response.extra);
        });

        submitSets(submitCollection.ongoing_tasks_with_names, "?landId=" + selectedLandId, true).then((response) => {
            setOngoingTasks(response.extra);
            console.log("Ongoing tasks : ", response.extra);

            if (response.extra.length === 0) {
                alertService.info('No Data Found !');
            }
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


    const handleChange = (event) => {
        setQuery(event.target.value);
    };
    const filteredTaskAssigned = Array.isArray(taskAssigned)
        ? taskAssigned.filter((task) => task.taskAssignedId)
        : [];

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };
    const handleTaskClick = (taskAssignedid, taskId) => {
        history.push(`/manageOngoingTask/${taskAssignedid}/${taskId}`);
        console.log("task assigned : ", taskAssignedid);
        console.log("task id : ", taskId);
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
                    <div key={taskAssigned.id} className="task-card" onClick={() => handleTaskClick(taskAssigned.taskAssignedId, taskAssigned.taskId)}>
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
    selectedCrop: state.selectedCrop
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
    setSelectedCrop: setSelectedCropAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);