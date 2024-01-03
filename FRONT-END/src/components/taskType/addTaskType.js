import  { useState, useEffect } from 'react';
import './addTaskType.css';
import Footer from '../footer/footer';
import Header from '../header/header';
import { useHistory } from "react-router-dom";
import { FaGlobeAmericas, FaLanguage, FaMapMarker } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';

const AddTaskType = ({ setSelectedLandId, selectedLandId }) => {
  const { t, i18n } = useTranslation();

  const history = useHistory();

  const [taskName, setTaskName] = useState('');
  const [landNames, setLandNames] = useState([]);
  const [landName, setLandName] = useState([]);
  const cropId = localStorage.getItem('CropIdLand');

  //add task type
  const handleAddTask = () => {
    const addTask = {
      taskName,
      cropId
    };

    submitSets(submitCollection.savetasktype, addTask, false)
      .then(res => {
        if (res && res.status) {
          alertService.success("Task type added successfully")
          history.push('/manageTaskType')
        } else {
          alertService.error("Error adding Task type")
        }
      })
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const goBack = () => {
    history.goBack();
  };

  const handleLandChange = (event) => {
    console.log("Land : ", event);
    setSelectedLandId(event);
  };

  useEffect(() => {
    submitSets(submitCollection.manageland, false).then((res) => {
      setLandNames(res.extra);
    });

    submitSets(submitCollection.getlandbyid, "?landId=" + selectedLandId, true).then((res) => {
      setLandName(res.extra.name);
    });

  }, [submitCollection.manageland, selectedLandId]);

  return (
    <div className="task-app-screen">
      <Header/>
      <div className="drop-down-container" style={{marginTop: "-11px"}}>

        <div className='landsectioncover'>
          <p className="landsection" style={{marginTop: "12px"}}>
            <FaMapMarker style={{ marginRight: '5px' }} />
            Selected Land: {landName}
          </p>
        </div>
        <p className="home-heading">{t('addtasktype')}</p>
      </div>

      <div>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder={t('tasktypename')}
          className="input-field"
        />
        <br />
        <button className="add-button" onClick={handleAddTask}>
          {t('add')}
        </button>
      </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(AddTaskType);
