import button from 'react-bootstrap/button';
import Navbar from 'react-bootstrap/Navbar';
import './SideNavPage.css'
import Footer from '../footer/footer';
import { useHistory } from 'react-router-dom';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AnimatedPage from '../../AnimatedPage';

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
  

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <AnimatedPage>
      <div className='side-nav-screen'>
        <p className='main-heading'>{t('welcome')}</p>
        <div className="position-absolute top-0 end-0 me-2">
          <Dropdown alignRight onSelect={handleLanguageChange}>
            <Dropdown.Toggle variant="secondary" style={{ background: 'none', border: 'none' }}>
              <FaGlobeAmericas style={{ color: 'white' }} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="en">English</Dropdown.Item>
              <Dropdown.Item eventKey="sl">Sinhala</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="side-nav-menu">
          <button className='menu-click'>
            <div onClick={ManageWorkers}>
              {t('workermanagement')}
            </div>
            </button>
          </div>

        <div className="side-nav-menu">
          <button className='menu-click'>
            <div onClick={ManageLand}>
              {t('managelands')}
            </div>
          </button>
        </div>

        <div className="side-nav-menu">
          <button className='menu-click'>
            <div onClick={ManageLot}>
              {t('managelots')}
            </div>
          </button>
        </div>

        <div className="side-nav-menu">
          <button className='menu-click'>
            <div onClick={ManageTaskType}>
              {t('managetasktype')}
            </div>
          </button>
        </div>

        <div className="side-nav-menu">
          <button className='menu-click'>
            <div onClick={ManageIncome}>
              {t('manageincome')}
            </div>
          </button>
        </div>

        <div className="side-nav-menu">
          <button className='menu-click'>
            <div onClick={ManageExpenseType}>
              {t('manageexpensetype')}
            </div>
          </button>
        </div>

        <div className="side-nav-menu">
          <button className='menu-click'>
            <div onClick={CompletedTasks}>
              {t('completedtasks')}
            </div>
          </button>
        </div>

        <br />
        <br />
        <div className='footer-alignment'>
          <Footer />
        </div>
      </div >
    </AnimatedPage >
  );
}

export default SideNavBar;