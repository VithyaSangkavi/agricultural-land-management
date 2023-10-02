import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Dropdown, Form, Navbar } from 'react-bootstrap';
import { CommentIcon, BellIcon, GearIcon, CircleIcon, MoonIcon, ChevronRightIcon } from '@primer/octicons-react';

import Alerts from './Alerts';
import { logoutAction } from '../../actions/auth/login_action';
import { camelizeTxt } from '../../_services/common.service';
//import NoteInfos from './NoteInfos';

import placecomp from '../../assets/img/place_comp.jpg';
import planigologo from '../../assets/img/logo_o.png';
/* import placeuser from '../../assets/img/place_user.jpg'; */

class NavbarTop extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {

        };
    }

    componentDidMount(){
      this._isMounted = true;

      if(this._isMounted){
        if(!this.props.signedobj || Object.keys(this.props.signedobj).length === 0 || !this.props.signedobj.signinDetails || Object.keys(this.props.signedobj.signinDetails).length === 0){
          this.props.history.push("/");
        }
      }
    }

    componentWillUnmount(){
      this._isMounted = false;
    }

    handleLogout = () => {
      this.props.setLogoutState("logout");
      this.props.handleSignObj(null);
      this.props.history.push("/");
    }

    render() {
      var cuserdetails = (this.props.signedobj!==null&&this.props.signedobj.signinDetails?this.props.signedobj.signinDetails:null);
      /* var ufname = (cuserdetails&&cuserdetails.userDto&&cuserdetails.userDto.fName?cuserdetails.userDto.fName:"");
      var ulname = (cuserdetails&&cuserdetails.userDto&&cuserdetails.userDto.lName?cuserdetails.userDto.lName:""); */

      return (
        <><Alerts/> {/* <NoteInfos/> */}
        {this.props.signedobj!==null&&this.props.signedobj.signinDetails?
          <Col className="navbar-main">
            <Navbar bg={this.props.dmode?"dark":"light"} variant={this.props.dmode?"dark":"light"}>
              <Col xs={2} style={{textAlign:"left"}}>
                {/* <Navbar.Brand className="navbar-toggle"><ThreeBarsIcon size={20}/></Navbar.Brand> */}
                <Navbar.Brand><span className="d-none d-sm-block"><img src={planigologo} alt="Planigo logo" /></span></Navbar.Brand>
              </Col>
              <Col xs={10} style={{textAlign:"left"}}>
                <Form inline style={{position:"absolute",right:"150px",top:"17px"}}>
                  <Form.Control as="select" size="sm" style={{width:"150px",marginLeft:"10px",fontSize:"11px",fontWeight:"600",background:"#f2f1ff",color:"#351b69",border:"none"}}>
                    <option value="0">{(cuserdetails&&cuserdetails.storeName?camelizeTxt(cuserdetails.storeName):"Store")}</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Control>
                  <Form.Control as="select" size="sm" style={{width:"150px",marginLeft:"10px",fontSize:"11px",fontWeight:"600",background:"#f2f1ff",color:"#351b69",border:"none"}}>
                    <option value="0">Branch</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Control>
                </Form>
                <ul className="list-inline" style={{position: "absolute", top: "0px", right: "0px"}}>
                  <li className="list-inline-item usernav-link" style={{padding:"0px"}}>
                    <Dropdown className="msgedrop-main">
                      <Dropdown.Toggle variant="" style={{padding:"18px 14px",marginTop:"-3px"}}>
                        <CommentIcon size={16} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <h4>Inbox</h4>
                        <Link to="#" className="msg-link dropdown-item"><Col><img src={placecomp} alt="" /> Mitchell William<br/><small>Yes, final changes added.</small></Col></Link>
                        <Link to="#" className="msg-link dropdown-item"><Col><img src={placecomp} alt="" /> Sam  Connor<br/><small>Send me all details.</small></Col></Link>
                        <Dropdown.Divider />
                        <Dropdown.Item href="#/action-1"><label>More Messages <ChevronRightIcon size={14}/></label></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  <li className="list-inline-item usernav-link"><BellIcon size={16} /></li>
                  <li className="list-inline-item usernav-link" style={{padding:"0px"}}>
                    <Dropdown>
                      <Dropdown.Toggle variant="" style={{padding:"18px 14px",marginTop:"-3px"}}>
                        <GearIcon size={16} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Inbox</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Profile Settings</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item href="#/action-2">Dark Mode
                          <input type="checkbox" id="switch" onChange={()=>this.props.dmodeToggle()} checked={(this.props.dmode!=null?this.props.dmode:false)} style={{display:"none"}}/>
                          <div className="switch-app">
                              <label className="switch" htmlFor="switch">
                                <div className="toggle"></div>
                                <div className="names">
                                  <p className="light"><CircleIcon size="14"/></p>
                                  <p className="dark"><MoonIcon size="14"/></p>
                                </div>
                              </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item href="#" onClick={this.handleLogout}>Logout</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                </ul>
              </Col>
            </Navbar>   
          </Col>
        :<></>}</>
      );
    }
}

const mapDispatchToProps = dispatch => ({
  setLogoutState: (payload) => dispatch(logoutAction(payload)),
});

export default withRouter(connect(null,mapDispatchToProps)(NavbarTop));