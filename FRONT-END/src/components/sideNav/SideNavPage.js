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

  const AddLand = () => {
    history.push('/insertland');
  };

  const AddLot = () => {
    history.push('/insertlot');
  };

  const AddTaskType = () => {
    history.push('/addTaskType');
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
          <Navbar.Brand onClick={AddLand}>Land Registration</Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand onClick={AddLot}>
            Lot Insertion
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand onClick={AddTaskType}>
            Add Task Type
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand href="#home">
            Crop
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div >
  );
}

export default SideNavBar;