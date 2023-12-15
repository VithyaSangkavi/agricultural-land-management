import { useState, useEffect } from 'react';
import './add-expense-type.css';
import Footer from '../footer/footer';
import { useHistory } from 'react-router-dom';
import { FaGlobeAmericas, FaLanguage, FaMapMarker } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { alertService } from '../../_services/alert.service';
import { MdArrowBackIos } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';

const AddExpenseType = ({ setSelectedLandId, selectedLandId }) => {

  const { t, i18n } = useTranslation();

  const history = useHistory();

  const [expenseType, setExpenseType] = useState('');
  const [landNames, setLandNames] = useState([]);
  const [landName, setLandName] = useState([]);

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
    <>
      <div className="expense-app-screen">
        <div className='main-heading'>

          <div className="outer-frame d-flex justify-content-between align-items-center">
            <div className="filter-container d-flex align-items-center">
              <MdArrowBackIos className="back-button" onClick={goBack} />
            </div>

            <div className="filter-container d-flex align-items-center">
              <div className="land-filter">
                <Dropdown onSelect={handleLandChange}>
                  <Dropdown.Toggle variant="secondary" style={{ background: 'none', border: 'none' }}>
                    <FaMapMarker style={{ color: 'white' }} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {landNames.map((land) => (
                      <Dropdown.Item eventKey={land.id} value={land.id}>
                        {land.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="language-filter">
                <Dropdown onSelect={handleLanguageChange}>
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
          </div>


        </div>

        <div className="drop-down-container">

          <div className='landsectioncover'>
            <p className="landsection">
              <FaMapMarker style={{ marginRight: '5px' }} />
              Selected Land: {landName}
            </p>
          </div>
          <p className="home-heading">{t('addexpensetype')}</p>
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

const mapStateToProps = (state) => ({
  selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
  setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddExpenseType);
