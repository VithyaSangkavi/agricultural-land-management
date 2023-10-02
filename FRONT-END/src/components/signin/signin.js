import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {Card, Col, Container, Form } from 'react-bootstrap';
import { ArrowLeftIcon } from '@primer/octicons-react';

import { submitCollection } from '../../_services/submit.service';
import { alertService } from '../../_services/alert.service';
import { cversion } from '../../_services/common.service';
import { AcInput, AcButton, ValT } from '../UiComponents/AcImports';

import { logoutAction } from '../../actions/auth/login_action';

import i18n from "i18next";
import { withTranslation } from "react-i18next";
import "../../_translations/i18n";

import './signin.css';

class SignInComponent extends React.Component{
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {
            lobj:{}, lval:{}
        }

        this.signinBtnElement = React.createRef();
    }
      
    componentDidMount(){
        this._isMounted = true;
        document.body.classList.add("s-page");
        if(this._isMounted){
            //this.props.handleSignObj(null);
            this.props.setResetState("logout");
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
        document.body.classList.remove("s-page");
    }

    handleSignin = (resp) => {
        //console.log(resp);
        if(resp && resp.status === true){
            this.props.handleSignObj(resp.extra);
            this.props.history.push("/dashboard");
        } else{
            alertService.error("Invalid username or password");
        }
    }

    handleEnterTrigger = (resp) => {
        this.signinBtnElement.click();
    }

    render(){
        const isRTL = (i18n.dir((this.props.langobj?this.props.langobj.languageDetails.code:"en")) === 'rtl');
        
        return (<>
            <Col className="landing-overlay"></Col>
            <Col xs={12} className="signin-maincontainer">
                <Col xs={12} md={5} className="landing-content signin-txtcontent d-none d-lg-block">
                    <h1>{this.props.t('nextgen')}<br/><small>{this.props.t('insaletec')}</small></h1>
                </Col>
                <Container>
                    <img src="assets/img/logo_o_inv.png" className="landing-logo" alt="planigo logo"/>

                    <Col xs={12} md={8} lg={5} className={"signin-content float-right"+(isRTL?" RTL":"")}>
                        <Card>
                            <Card.Body>
                                <Link to="/landing"><ArrowLeftIcon className="back-link" size={32}/></Link>
                                <h3>{this.props.t('sintoacc')}</h3>
                                <Form>
                                    <Form.Group controlId="formBasicEmail" style={{marginTop:"25px"}}>
                                        <AcInput atype="text" aid="userName" aobj={this.state.lobj} avset={this.state.lval} aplace="Email Address" avalidate={[ValT.empty,ValT.email]} akeyenter={this.handleEnterTrigger} showlabel={true} autofocus={true}/>
                                    </Form.Group>
                                    <div id="formBasicPassword" className={"form-group"+(isRTL?" float-right":"")} style={{width:"60%"}}>
                                        <AcInput atype="password" aid="password" aobj={this.state.lobj} avset={this.state.lval} aplace="Password" avalidate={[ValT.empty]} akeyenter={this.handleEnterTrigger} showlabel={true}/>
                                    </div>
                                    
                                    <span style={{marginLeft: "-10px"}}><AcButton aref={input => this.signinBtnElement = input} avariant="primary" atype="button" asubmit={submitCollection.signin} aclass={(isRTL?"RTL":"")} aobj={this.state.lobj} avalidate={this.state.lval} aresp={this.handleSignin}>{this.props.t('siginbtn')}</AcButton></span>
                                    <label className="link-label text-right"><Link to="#">{this.props.t('formfield.forgetpw')}</Link></label>
                                    
                                    <Col xs={12} className="newaccount-footer">
                                        <h4>
                                            <small>{this.props.t('noaccyet')}</small><br/>
                                            <Link to="#">{this.props.t('cnewacc')}</Link>
                                        </h4>
                                    </Col>

                                    <Col xs={12} className="landing-footer">
                                        <ul className="list-inline" style={{width:"100%"}}>
                                            <li className="list-inline-item">{this.props.t('support')}</li>
                                            <li className="list-inline-item">{this.props.t('toservice')}</li>
                                            <li className="list-inline-item">{this.props.t('ppolicy')}</li>
                                            <li className="list-inline-item float-right d-none d-sm-block" style={{color:"#ccc",fontSize:"10px"}}>v{cversion}</li>
                                        </ul>
                                    </Col>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>        
                </Container>
            </Col>
        </>);
    }
}

const mapDispatchToProps = dispatch => ({
    setResetState: (payload) => dispatch(logoutAction(payload)),
});

export default withTranslation()(withRouter(connect(null,mapDispatchToProps)(SignInComponent)));