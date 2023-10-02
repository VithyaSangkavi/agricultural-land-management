import React from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { Col, Image } from 'react-bootstrap';
import { HomeIcon, } from '@primer/octicons-react';

import { cversion } from '../../_services/common.service';

//import planigologo from '../../assets/img/logo_wt.png';
import placeuser from '../../assets/img/place_user.jpg';

function SidebarMenu(props) {
    const location = useLocation();

    const handleRedirect = (cpath) => {
      props.history.push(cpath);
    }

    const checkUrlContains = (cpath) => {
      return location.pathname.includes(cpath);
    }

    const handleDropDownView = (evt, cid) => {
      evt.target.classList.toggle("active");
      document.getElementById(cid).classList.toggle("d-none");
    }

    var cuserdetails = (props.signedobj!==null&&props.signedobj.signinDetails?props.signedobj.signinDetails:null);
    var ufname = (cuserdetails&&cuserdetails.userDto&&cuserdetails.userDto.fName?cuserdetails.userDto.fName:"");
    var ulname = (cuserdetails&&cuserdetails.userDto&&cuserdetails.userDto.lName?cuserdetails.userDto.lName:"");

    //console.log(location);
    return (
    <>{props.signedobj!==null&&props.signedobj.signinDetails?
    <Col className="sidebar-main">
      {/* <img src={planigologo} alt="Planigo logo" /> */}
      <div className="userdetails-content" style={{height:"60px",background:"rgba(0,0,0,.1)"}}><span className="d-none d-sm-block"><Image src={placeuser} roundedCircle style={{height:"35px"}} /></span>
      <span style={{fontWeight:"600",marginRight:"20px",position:"absolute",marginLeft:"65px",marginTop:"16px",lineHeight:"15px",width:"100%",color:"#ccc"}}>{ufname+" "+ulname}
      <br/><small style={{fontSize:"11px"}}>Store Manager</small></span></div>
      <ul className="submenu-items">
        <li className={"menu-item"+(checkUrlContains("/dashboard")?" active":"")} onClick={e => handleRedirect("/dashboard")} style={{marginTop:"15px"}}><div className="content-main"><div className="content-text">Dashboard</div> <HomeIcon size={18}/></div></li>
      </ul>
      <span className="d-none d-sm-block" style={{position:"absolute",bottom:"5px",left:"20px",fontSize:"10px",color:"#ccc"}}>v{cversion}</span>
    </Col>
    :<></>}
    </>);
}

export default withRouter(SidebarMenu);