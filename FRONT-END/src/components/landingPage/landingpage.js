import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {Button, Col, Container} from 'react-bootstrap';
import { ArrowRightIcon } from '@primer/octicons-react';

import { langList } from '../../_services/common.service';

import i18n from "i18next";
import { useTranslation } from "react-i18next";
import "../../_translations/i18n";

import './landingpage.css';

export const ViewLandingPage = (props) => {
    /* var langOptList = langList.map((litem,lidx) => {
        return <Dropdown.Item href="en" key={lidx} onClick={e => props.handleLang(lidx,e)} >{litem.text}</Dropdown.Item>;
    }); */
    const { t } = useTranslation();
    const isRTL = (i18n.dir() === 'rtl');
    
    return (
      <>
        <Col className="landing-overlay"></Col>
        <Col xs={12} className={"landing-inner-content"+(isRTL?" RTL":"")}>
            <Col xs={12} className="landing-content" style={{paddingLeft:"5rem"}}>
                <h1><small>{t("letsmake")}</small><br/>{t("moreprofit")}</h1>

                <h4>{t("createaccount")}</h4>
                <Button variant="warning" className="landing-gsbtn">{t("getstart")} <ArrowRightIcon size={24} /></Button>
            </Col> 
            <Container>
                <img src="assets/img/logo_o_inv.png" className="landing-logo" alt=""/>
                {/* <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic"> {props.langobj?props.langobj.languageDetails.text:""} </Dropdown.Toggle>
                    <Dropdown.Menu>{langOptList}</Dropdown.Menu>
                </Dropdown> */}
                <Link to="/"><Button variant="warning" className="landing-signlink">{t("siginbtn")}</Button></Link>
                   
            </Container>
        </Col>
        <Col xs={12} className={"landing-footer"+(isRTL?" RTL":"")}>
            <ul className="list-inline" style={{marginLeft:"6rem"}}>
                <li className="list-inline-item">{t("support")}</li>
                <li className="list-inline-item">{t("toservice")}</li>
                <li className="list-inline-item">{t("ppolicy")}</li>
            </ul>
        </Col>
      </>
    );
   };

class LandingPage extends React.Component{
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            
        }
    }
      
    componentDidMount(){
        this._isMounted = true;

        if(this._isMounted){
            document.body.classList.add("l-page");

            if(this.props.langobj){
                i18n.changeLanguage(this.props.langobj.languageDetails.code);
            }
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
        document.body.classList.remove("l-page");
    }

    handleLang = (lcode, evt) => {
        evt.preventDefault();
        i18n.changeLanguage(langList[lcode].code);
        this.props.handleLangObj(langList[lcode]);
    }

    render(){
        
        return (<ViewLandingPage handleLang={this.handleLang} {...this.props}/>);
    }
}

export default withRouter(connect()(LandingPage));