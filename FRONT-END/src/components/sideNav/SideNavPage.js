import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './SideNavPage.css'
import Footer from '../footer/footer';

function SideNavBar() {
  return (
    <div className='side-nav-screen'>
      <p className='main-heading'>WELCOME</p>
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand href="/addWorker">Worker Registration</Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand href='#'>Land Registration</Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="side-nav-menu">
        <Container>
          <Navbar.Brand href="#home">
            Lot Insertion
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
      <Footer />
    </div >
  );
}

export default SideNavBar;