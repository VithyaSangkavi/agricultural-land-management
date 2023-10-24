import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './SideNavPage.css'
import Footer from '../footer/footer';
import { useHistory } from 'react-router-dom';

function SideNavBar() {
  const history = useHistory();

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
      <p className='main-heading'>WELCOME</p>
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
    </div >
  );
}

export default SideNavBar;