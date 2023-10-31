import Container from 'react-bootstrap/Container';
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

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <AnimatedPage>
      <div className='side-nav-screen'>
        <p className='main-heading'>{t('welcome')}</p>
        <div className="position-absolute top-0 end-0 mt-2 me-2">
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
        <Navbar className="side-nav-menu">
          <Container>
            <Navbar.Brand onClick={ManageWorkers}>
              {t('workermanagement')}
            </Navbar.Brand>
          </Container>
        </Navbar>
        <br />
        <Navbar className="side-nav-menu">
          <Container>
            <Navbar.Brand onClick={ManageLand}>
              {t('managelands')}
            </Navbar.Brand>
          </Container>
        </Navbar>
        <br />
        <Navbar className="side-nav-menu">
          <Container>
            <Navbar.Brand onClick={ManageLot}>
              {t('managelots')}
            </Navbar.Brand>
          </Container>
        </Navbar>
        <br />
        <Navbar className="side-nav-menu">
          <Container>
            <Navbar.Brand onClick={ManageTaskType}>
              {t('managetasktype')}
            </Navbar.Brand>
          </Container>
        </Navbar>
        <br />
        <Navbar className="side-nav-menu">
          <Container>
            <Navbar.Brand onClick={ManageIncome}>
              {t('manageincome')}
            </Navbar.Brand>
          </Container>
        </Navbar>
        <br />
        <Navbar className="side-nav-menu">
          <Container>
            <Navbar.Brand onClick={ManageExpenseType}>
              {t('manageexpensetype')}
            </Navbar.Brand>
          </Container>
        </Navbar>

        <br />
        <div className='footer-alignment'>
          <Footer />
        </div>
      </div >
    </AnimatedPage >
  );
}

export default SideNavBar;