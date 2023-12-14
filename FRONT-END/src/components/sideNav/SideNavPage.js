import { useState } from 'react';
import button from 'react-bootstrap/button';
import Navbar from 'react-bootstrap/Navbar';
import './SideNavPage.css'
import Footer from '../footer/footer';
import { useHistory } from 'react-router-dom';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AnimatedPage from '../../AnimatedPage';
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrUserWorker, GrTasks } from "react-icons/gr";
import { MdOutlineBallot, MdTask } from "react-icons/md";
import { FaLandmark, FaCashRegister } from "react-icons/fa6";
import { HiOutlineCash } from "react-icons/hi";

function SideNavBar() {

  const history = useHistory();
  const { t, i18n } = useTranslation();

  const ManageWorkers = () => {
    history.push('/manageWorkers');
  };

  const ManageLand = () => {
    history.push('/managelands');
  };

  const ManageLot = () => {
    history.push('/managelots');
  };

  const ManageTaskType = () => {
    history.push('/manageTaskType');
  };

  const ManageExpenseType = () => {
    history.push('/manageExpenseType');
  };

  const ManageIncome = () => {
    history.push('/manageIncome');
  };

  const CompletedTasks = () => {
    history.push('/viewcompltedtasks');
  };

  const Reports = () => {
    history.push('/report');
  };


  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const [isBackClicked, setIsBackClicked] = useState(false);

  const goBack = () => {
    setIsBackClicked(true);
    setTimeout(() => {
      history.goBack();
    }, 500);
  };

  return (
    <>
      <AnimatedPage>
        <div className={`side-nav-screen ${isBackClicked ? 'back-animation' : ''}`}>
          <div className="position-absolute top-0 start-0 ms-0">
            <IoMdArrowRoundBack className="side-back-button" onClick={goBack} style={{marginLeft: "28%"}}/>
          </div>
          <p className='main-heading'>{t('welcome')}</p>
         
          <div className="side-nav-menu">
            <button className='menu-click'>
              <div onClick={ManageWorkers}>
                <GrUserWorker />  {t('workermanagement')}
              </div>
            </button>
          </div>

          <div className="side-nav-menu">
            <button className='menu-click'>
              <div onClick={ManageLand}>
                <FaLandmark />  {t('managelands')}
              </div>
            </button>
          </div>

          <div className="side-nav-menu">
            <button className='menu-click'>
              <div onClick={ManageLot}>
                <MdOutlineBallot />  {t('managelots')}
              </div>
            </button>
          </div>

          <div className="side-nav-menu">
            <button className='menu-click'>
              <div onClick={ManageTaskType}>
                <GrTasks />  {t('managetasktype')}
              </div>
            </button>
          </div>

          <div className="side-nav-menu">
            <button className='menu-click'>
              <div onClick={ManageIncome}>
                <HiOutlineCash />  {t('manageincome')}
              </div>
            </button>
          </div>

          <div className="side-nav-menu">
            <button className='menu-click'>
              <div onClick={ManageExpenseType}>
                <FaCashRegister />  {t('manageexpensetype')}
              </div>
            </button>
          </div>

          <div className="side-nav-menu">
            <button className='menu-click'>
              <div onClick={CompletedTasks}>
                <MdTask />  {t('completedtasks')}
              </div>
            </button>
          </div>

        </div >
      </AnimatedPage >

      <div className='footer-alignment'>
        <Footer />
      </div>
    </>
  );
}

export default SideNavBar;