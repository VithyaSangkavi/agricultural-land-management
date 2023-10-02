import React from 'react';
import { withRouter } from 'react-router-dom';
import {Button, Col, Form, Row, Table} from 'react-bootstrap';
import Chart from "react-apexcharts";
import { ArrowUpIcon, ArrowDownIcon } from '@primer/octicons-react';

import './dashboard.css';

import revenueIcon from '../../assets/img/icons/stats.png';
import mbillIcon from '../../assets/img/icons/pair-of-bills.png';
import layoutIcon from '../../assets/img/icons/layout.png';
import squareIcon from '../../assets/img/icons/square.png';

class DashboardComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            options: {
                chart: {
                  toolbar: {
                    show: false,
                  }
                },
                xaxis: {
                  categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
                  labels: {
                    show: false,
                  }
                },
                yaxis: {
                  labels: {
                    show: false,
                  } 
                },
                stroke: {
                  curve: 'smooth',
                },
                grid: {
                    show: false
                },
                dataLabels: {
                    enabled: false,
                }
            },
            series: [
            {
                name: "",
                data: [30, 40, 45, 50, 49, 60, 70, 91]
            }
            ]
        }
    }
      
    componentDidMount(){
        
    }

    handleFilterObject = () => {

    }

    render(){
        return (<>
            <Col xs={12} className="main-content">
                <Col xs={12} className="dashboard-content">
                    <Col className="custom-filters">
                        <ul className="list-inline">
                            <li className="list-inline-item" style={{marginRight:"0px"}}>
                                <Col>
                                    <label className="filter-label">Date Range</label>
                                    <Form.Control placeholder="From date" onKeyUp={e => this.handleFilterObject(e,"fromdate","enter")} style={{maxWidth:"110px"}}/>
                                </Col>        
                            </li>
                            <li className="list-inline-item">
                                <Col>
                                    <label className="filter-label"></label>
                                    <Form.Control placeholder="To date" onKeyUp={e => this.handleFilterObject(e,"todate","enter")} style={{maxWidth:"110px"}}/>
                                </Col>        
                            </li>
                            <li className="list-inline-item" style={{marginRight:"10px"}}>
                                <label className="filter-label">Store</label>
                                <Form.Control as="select" onChange={e => this.handleFilterObject(e,"store","click")} style={{width:"150px"}}>
                                    <option value="">All</option>
                                </Form.Control>        
                            </li>
                            <li className="list-inline-item" style={{marginRight:"15px"}}>
                                <label className="filter-label">Department</label>
                                <Form.Control as="select" onChange={e => this.handleFilterObject(e,"department","click")} style={{width:"150px"}}>
                                    <option value="">All</option>
                                </Form.Control>        
                            </li>
                            <li className="list-inline-item">
                                <Button type="button" variant="warning" className="search-link" onClick={e => this.handleTableSearch(e,"click")}>Filter</Button>        
                            </li>
                        </ul>
                    </Col>
                    <Col>
                        <Row>
                            <Col className="minicontent-main" xs={12} sm={6} lg={3}>
                                <Col className="sub-content">
                                    <label className="icon-view"><img src={revenueIcon} alt="revenue icon"/></label>
                                    <h4><small>Total Display Unit Revenue</small><br/>$89,000</h4>
                                    <Chart className="mchart-view" options={this.state.options} series={this.state.series} type="area" height={100} />
                                </Col>
                            </Col>
                            <Col className="minicontent-main" xs={12} sm={6} lg={3}>
                                <Col className="sub-content">
                                    <label className="icon-view b2"><img src={mbillIcon} alt="profit icon"/></label>
                                    <h4><small>Profit</small><br/>$14,000</h4>
                                    <Chart className="mchart-view" options={this.state.options} series={this.state.series} type="area" height={100} />
                                </Col>
                            </Col>
                            <Col className="minicontent-main" xs={12} sm={6} lg={3}>
                                <Col className="sub-content">
                                    <label className="icon-view b3"><img src={layoutIcon} alt="layout icon"/></label>
                                    <h4><small>Layout</small></h4>
                                    <ul>
                                        <li><label>New year stocks</label></li>
                                        <li><label>Year end</label></li>
                                    </ul>
                                    <label>Lasted 3 months</label>
                                </Col>
                            </Col>
                            <Col className="minicontent-main" xs={12} sm={6} lg={3}>
                                <Col className="sub-content">
                                    <label className="icon-view b4"><img src={squareIcon} alt="square icon"/></label>
                                    <h4><small>Profit Per Square Feet</small><br/>$1,500</h4>
                                    <Chart className="mchart-view" options={this.state.options} series={this.state.series} type="area" height={100} />
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="minicontent-main" xs={12} sm={6} lg={4}>
                                <Col className="sub-content">
                                    <h3>Top Shops</h3>
                                    <Table size="sm">
                                        <thead>
                                            <tr>
                                                <th style={{width:"30%"}}></th>
                                                <th className="highlight">SALE</th>
                                                <th className="highlight">S%</th>
                                                <th className="highlight">PROFIT</th>
                                                <th className="highlight">p%</th>
                                                <th className="highlight">PROFIT/SqFt</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="highlight">London</td>
                                                <td>156,000</td>
                                                <td>25% <ArrowUpIcon size={10}/></td>
                                                <td>29,000</td>
                                                <td>8.1% <ArrowDownIcon className="down" size={10} /></td>
                                                <td>1132</td>
                                            </tr>
                                            <tr>
                                                <td className="highlight">London</td>
                                                <td>156,000</td>
                                                <td>25% <ArrowUpIcon size={10} /></td>
                                                <td>29,000</td>
                                                <td>8.1% <ArrowDownIcon className="down" size={10} /></td>
                                                <td>1132</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Col>
                            <Col className="minicontent-main" xs={12} sm={6} lg={4}>
                                <Col className="sub-content">
                                    <h3>Top Departments</h3>
                                </Col>
                            </Col>
                            <Col className="minicontent-main" xs={12} sm={6} lg={4}>
                                <Col className="sub-content">
                                    <h3>Top Products</h3>
                                </Col>
                            </Col>
                        </Row>
                    </Col>
                </Col>    
            </Col>
            
        </>);
    }
}

export default withRouter(DashboardComponent);