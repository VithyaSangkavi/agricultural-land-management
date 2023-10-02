import React from 'react';
import { Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Detector } from 'react-detect-offline';
import './App.css';

import i18n from "i18next";
import { withTranslation } from "react-i18next";
import "./_translations/i18n";

import NavbarTop from './components/common_layouts/navbartop';
import SidebarMenu from './components/common_layouts/sidebarmenu';

import { submitCollection } from './_services/submit.service';
import { usrRoles } from './_services/common.service';
import { submitSets } from './components/UiComponents/SubmitSets';
import LazyLoading from './components/common_layouts/lazyloading';
import RoleBasedRouting from './components/common_layouts/rolebaserouting';

import LandingPage from './components/landingPage/landingpage';
import SignInComponent from './components/signin/signin';
import NoMatchComponent from './components/nomatch/nomatch';
import ResetPassword from './components/resetPassword/ResetPassword';
import ConfirmationPassword from './components/resetPassword/ConfirmationPassword';
import DashboardComponent from './components/dashboard/dashboard';

import { loginAction } from './actions/auth/login_action';
import { languageAction } from './actions/auth/login_action';


class App extends React.Component {
  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      dmode: (localStorage.getItem("pgdmode")?true:false), //dark mode
      cstat: null,
      signedobj: null,
    }
  }
  
  componentDidMount(){
    this._isMounted = true;

    if(this._isMounted){
      //add class d-mode if darkmode activated
      if(this.state.dmode){
        document.body.classList.add("d-mode");
      } else{
        document.body.classList.remove("d-mode");
      }
    }
    //this.getComStat(); //get online stat
  }
  componentWillUnmount(){
    this._isMounted = false;
  }
  //dark mode toggle
  dmodeToggle = () => {
    if(this.state.dmode){
      document.body.classList.remove("d-mode");
      localStorage.removeItem("pgdmode",true);
    } else{
      document.body.classList.add("d-mode");
      localStorage.setItem("pgdmode",true);
    }
    
    this.setState({
      dmode: !this.state.dmode
    });
  }
  //get b-end commiunication stat
  getComStat = () => {
    submitSets(submitCollection.checkstat, null).then(resp => {
      //console.log(resp);
      this.setState({cstat:resp});
    });
  }

  handleSignObj = (cobj) => {
    this.props.setSigninObj(cobj);
  }

  handleLangObj = (cobj) => {
    console.log(cobj);
    this.props.setLangObj(cobj);
  }
  
  render(){
    const isRTL = i18n.dir((this.props.langState?this.props.langState.languageDetails.code:"en"));
    //console.log(isRTL);
    return (
      <div className="App" dir={isRTL}>
        <Detector  polling={{interval: 10000}} render={({ online }) => (
          <div className="netdown-main"><div className={"alert alert-dark netdown-warning "+(online ? "d-none" : "show-warning")}>
            You are currently {online ? "online" : "offline"}
          </div></div>
        )} />

        <NavbarTop dmode={this.state.dmode} signedobj={this.props.signState} handleSignObj={this.handleSignObj} dmodeToggle={this.dmodeToggle}/>
        <SidebarMenu dmode={this.state.dmode} signedobj={this.props.signState}/>
        <LazyLoading setProdList={this.props.setProdList}/>
        <Switch>
          <RoleBasedRouting path="/resetPassword"><ResetPassword /></RoleBasedRouting>
          <RoleBasedRouting path="/confirmation"><ConfirmationPassword /></RoleBasedRouting>

          <RoleBasedRouting path="/dashboard" exact roles={[usrRoles.CM]}><DashboardComponent/></RoleBasedRouting>
          <RoleBasedRouting path="/landing"><LandingPage handleLangObj={this.handleLangObj} langobj={this.props.langState}/></RoleBasedRouting>
          <RoleBasedRouting exact path="/"><SignInComponent langobj={this.props.langState} handleSignObj={this.handleSignObj}/></RoleBasedRouting>
          <RoleBasedRouting><NoMatchComponent signedobj={this.props.signState} /></RoleBasedRouting>
        </Switch>
        
      </div> 
    );  
  }
  
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  setSigninObj: (payload) => dispatch(loginAction(payload)),
  setLangObj: (payload) => dispatch(languageAction(payload))
});

export default withTranslation()(withRouter(connect(mapStateToProps,mapDispatchToProps)(App)));
