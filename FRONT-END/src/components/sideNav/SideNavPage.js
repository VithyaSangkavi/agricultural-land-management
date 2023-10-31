import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './SideNavPage.css'
import Footer from '../footer/footer';
import { useHistory } from 'react-router-dom';
import NavBar from '../navBar/navbar';
import { useState } from 'react';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';



function SideNavBar() {

  const history = useHistory();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
};


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


  return (
    <div className='side-nav-screen'>

      <div className="language-selector position-absolute top-0 end-0 mt-2 me-2">
        <DropdownButton
          id="dropdown-language"
          title={<FaLanguage />}
          onSelect={handleLanguageChange}
          variant="secondary"
        >
          <Dropdown.Item eventKey="en">
            <FaGlobeAmericas /> English
          </Dropdown.Item>
          <Dropdown.Item eventKey="sl">
            <FaGlobeAmericas /> Sinhala
          </Dropdown.Item>
        </DropdownButton>
      </div>

      <p className='main-heading'>{t('welcome')}</p>
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand onClick={ManageWorkers}>Worker Management</Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand onClick={ManageLand}>Manage Lands</Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand onClick={ManageLot}>
            Manage Lot
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand onClick={ManageTaskType}>
            Manage Task Type
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand onClick={ManageIncome}>
            Manage Income
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand onClick={ManageExpenseType}>
            Manage Expense Type
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className='footer-alignment'>
        <Footer />
      </div>
    </div >
  );
}

export default SideNavBar;