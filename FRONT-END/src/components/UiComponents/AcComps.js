import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, ListGroup, Modal, Pagination, Table } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { XIcon, DotFillIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, XCircleFillIcon } from '@primer/octicons-react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {useDropzone} from 'react-dropzone';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { validateSets } from './ValidateSets';
import { submitSets } from './SubmitSets';

import { alertService } from '../../_services/alert.service';
import { objToQueryParam, btnPressedKeyCode, getPager } from '../../_services/common.service';
import { validateObj } from '../../_services/submit.service';

import loadinggif from '../../assets/img/pleasewait.gif';

class AcButtonComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disableEvents: false,
        }
    }
    //handle onclick change
    handleClick = () => {
        if (this.props.asubmit !== undefined) {
            if(this.props.aconfirm){
                confirmAlert({
                    title: 'Confirm to submit',
                    message: 'Are you sure to continue this task?',
                    buttons: [{
                        label: 'Yes',
                        onClick: () => {
                            this.handleSaveClick();
                        }
                    }, {
                        label: 'No',
                        onClick: () => {
                            //
                        }
                    }
                    ]
                });    
            } else{
                this.handleSaveClick();
            }
        } else{
            if (this.props.aresp !== undefined) {
                this.props.aresp(false);
            }
        }
    }

    handleSaveClick = () => {
        var cdata = (this.props.asubmit.queryparam ? objToQueryParam(this.props.aobj) : this.props.aobj); //if call have query params this converts object to query params
        if(this.props.avalidate && Object.keys(this.props.avalidate).length > 0){
            Object.keys(this.props.avalidate).forEach(((mitem) => {
                if(typeof this.props.avalidate[mitem] === "object"){
                    var newArray = (typeof this.props.avalidate[mitem] === "object"?this.props.avalidate[mitem].join(" "):"");
                    this.props.avalidate[mitem] = newArray;
                }
            }));
        }
        var checkobj = validateObj(this.props.avalidate, this.props.aobj); //validate object values
        if (checkobj.status) { //if validate okay
            this.setState({disableEvents:true}); //disable btn
            submitSets(this.props.asubmit, cdata, true).then(res => {
                if (this.props.aresp !== undefined) {
                    this.props.aresp(res); //send response to button handle response
                }
                this.setState({disableEvents:false}); //enable btn
            });
        } else {
            alertService.error(checkobj.msg); //send alert if error occured
            if (this.props.aresp !== undefined) {
                this.props.aresp(checkobj);
            }
        }
    }

    render() {
        var cuslist = (this.props.aclass!==undefined?this.props.aclass:"");
        return (
            <Button ref={this.props.aref} id={this.props.eleid?this.props.eleid:""} variant={this.props.avariant} className={cuslist} onClick={this.handleClick} disabled={this.props.disabled||this.state.disableEvents} style={{marginLeft:"10px"}}>
                {this.props.atitle !== undefined ? this.props.atitle : this.props.children}
            </Button>
        )
    }
}

class AcInputComponent extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            cval: "", //default value
            validatestate: null, //validate state
            validatemsg: "", //validate message
            valchanged: false, //is changed value
            warningclses: "", //warning class sets
        }
    }
    //update state onchange props
    static getDerivedStateFromProps(props) {
        return { cval: (props.aobj && props.aobj[props.aid] !== undefined ? props.aobj[props.aid] : "") };
    }

    componentDidMount() {
        this._isMounted = true;
        //get obj val or defval and set to cval also updates cobj val
        var cobj = this.props.aobj;
        if ((cobj !== undefined && cobj[this.props.aid] !== undefined) || this.props.adefval !== undefined) {
            if(this._isMounted){this.setState({ cval: (cobj[this.props.aid] ? cobj[this.props.aid] : this.props.adefval ? this.props.adefval : ""), warningclses:"" });}
            cobj[this.props.aid] = (cobj[this.props.aid] ? cobj[this.props.aid] : this.props.adefval ? this.props.adefval : "");
        } else{
            //if type=select set defval as data list's first value if available
            if(cobj !== undefined && this.props.atype === "select" && this.props.adata && Object.keys(this.props.adata).length > 0){
                cobj[this.props.aid] = Object.keys(this.props.adata)[0];
            }
        }
        //validate object values set
        if (cobj !== undefined && this.props.avset !== undefined) {
            var cvobj = this.props.avset;
            cvobj[this.props.aid] = this.props.avalidate;
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    //validate input validators
    handleValidate = (ctxt) => {
        var cvalarr = this.props.avalidate ? this.props.avalidate : []; //get validators from props
        var creturns = validateSets(this.props.aplace, cvalarr, ctxt); //send to validateSets and validate with val
        if(this.props.achange){this.props.achange(creturns.cval);} //if onchange event avalilable trigget it
        this.setState({ //update states
            validatestate: creturns.validatestate,
            validatemsg: creturns.validatemsg,
            cval: creturns.cval,
            warningclses: (creturns.warclass?creturns.warclass:"")
        });
        if (this.props.aobj !== undefined) { //update main object value
            var cobj = this.props.aobj;
            cobj[this.props.aid] = creturns.cval;
        }
    }
    //onpress commonservice->btnPressedKeyCode and key enter event handler available trigger onenter key event
    handleKeyEnter = (e) => {
        if(e.which === btnPressedKeyCode && this.props.akeyenter){
            this.props.akeyenter();
        }
    } 

    render() {
        var csdata = this.props.adata; //if select -> get data list
        var cdefval = this.state.cval; //get default value
        //loop through data list and create options list
        var csdataordered = {};
        if(csdata){Object.keys(csdata).sort().forEach(function(key) {csdataordered[key] = csdata[key];});}
        var seldata = (csdataordered ? Object.keys(csdataordered).map(function (key, idx) { return <option value={key} key={idx}>{csdataordered[key]}</option>; }) : "");
        var cuslist = (this.props.aclass!==undefined?" "+this.props.aclass:"");
        //render element with given type - ex: date,textarea,select
        return (
            <div className="mtd-form-field" style={{ marginBottom: "10px" }}>
                {this.props.atype === "date" ?
                    <DatePicker className={"form-control form-control-sm form__field" + cuslist + " "+this.state.warningclses} selected={this.state.cval} dateFormat="yyyy-MM-dd" onBlur={e => this.handleValidate(e.target.value)} onChange={date => this.handleValidate(date)} disabled={this.props.disabled} />
                    : this.props.atype === "time" ?
                        <DatePicker className={"form-control form-control-sm form__field" + cuslist + " "+this.state.warningclses} selected={this.state.cval} dateFormat="hh:mm a" onBlur={e => this.handleValidate(e.target.value)} onChange={date => this.handleValidate(date)} showTimeSelect showTimeSelectOnly disabled={this.props.disabled} />
                        : this.props.atype === "textarea" ?
                            <textarea rows={this.props.arows} value={cdefval !== "" ? cdefval : ""} className={"form-control form-control-sm form__field" + cuslist + " "+this.state.warningclses} placeholder={this.props.aplace} onBlur={e => this.handleValidate(e.target.value)} onChange={e => this.handleValidate(e.target.value)} disabled={this.props.disabled} ></textarea>
                            : this.props.atype === "select" ?
                                <select className={"form-control form-control-sm form__field" + cuslist + " "+this.state.warningclses} value={cdefval !== "" ? cdefval : ""} onChange={e => this.handleValidate(e.target.value)} disabled={this.props.disabled} >
                                    {seldata}
                                </select>
                                : <input type={this.props.atype} value={cdefval !== "" ? cdefval : ""} className={"form-control form-control-sm form__field" + cuslist + " "+this.state.warningclses} placeholder={this.props.aplace} onBlur={e => this.handleValidate(e.target.value)} onKeyDown={e => this.handleKeyEnter(e)} onChange={e => this.handleValidate(e.target.value)} disabled={this.props.disabled} autoComplete={this.props.autocomp} autoFocus={this.props.autofocus}/>}

                {this.props.aplace?<label className="form__label">{this.props.aplace}</label>:<></>}
                {this.state.validatestate && this.props.showlabel ? <label className={"valabel " + this.state.validatestate}>{this.state.validatemsg}</label> : <></>}
            </div>
        )
    }
}

const ExportCSV = ({csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button type="button" variant="secondary" className="export-link" onClick={(e) => exportToCSV(csvData,fileName)}>Export</Button>
    )
}

class AcTableComponent extends React.Component{
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            ctableheaders: [],
            ctablebody: [], cpagebydata: [],
            pageItemsList: [], defaultPageCount: 10, currentPage: 1, totalPages: 0, //pagination
            isonloadtable: true, totalresultscount: 0,
        }
    }

    componentDidMount(){
        this._isMounted = true;
        setTimeout(() => {
            if(this._isMounted){
                this.setState({
                    ctableheaders: this.props.aheaders,
                    ctablebody: this.props.abody,
                    pagedItemsList: this.props.abody,
                    cpagebydata: this.props.alldata,
                    currentPage: this.props.startpage,
                    totalresultscount: this.props.totalresults,
                }, () => {
                    if(this.state.currentPage > 1 && this.props.asearchobj && Object.keys(this.props.asearchobj).length > 0){
                        this.setPage(this.state.currentPage,false); 
                    } else{
                        this.setPage(1,false); 
                    }
                });    
            }
        }, 100);
    }
    //pager
    setPage = (cpage,isnewpage) => {
        var pageLength = (this.props.pagecount?this.props.pagecount:this.state.defaultPageCount);
        var citems = (this.state.ctablebody?JSON.parse(JSON.stringify(this.state.ctablebody)):[]);
        var pager = getPager(this.state.totalresultscount,cpage,pageLength);
        // check page isn't out of range
        if (cpage < 1 || cpage > pager.totalPages) {
            this.setState({
                pageItemsList: [],
                currentPage: 1,
                totalPages: 0
            });
            return;
        }
        
        var cfindList = (this.state.toridata?this.state.toridata.find(x => x.page === this.state.startpage):undefined);
        
        if(isnewpage && this.props.pagetype&&this.props.pagetype==="ajax"&&this.props.handlePageChange){
            if(cfindList&&cfindList){
                this.setState({
                    ctablebody: cfindList
                });
            } else{
                this.props.handlePageChange(cpage);
            }
        }

        this.setState({
            pageItemsList:citems,
            currentPage: pager.currentPage,
            totalPages: pager.totalPages,
            isonloadtable: false,
        });    
    }
    //table sort
    handleTableSort = (eidx,etype) => {
        var ctablebody = this.props.abody;
        var csorted = (eidx>-1?(etype==="ASC"?([].concat(ctablebody).sort((a, b) => a[eidx] > b[eidx] ? 1 : -1)):([].concat(ctablebody).sort((a, b) => a[eidx] < b[eidx] ? 1 : -1))):ctablebody);
        
        this.setState({
            ctablebody: csorted
        });
        /* setTimeout(() => {
            this.setPage(1,false); 
        }, 200); */
    }
    //set filter object
    handleFilterObject = (evt) => {

    }
    //table search
    handleTableSearch = (evt,etype) => {
        if(etype === "click" || (etype === "enter" && evt.which === 13)){
            var ctxt = evt.target.value;
            var ctablebody = this.props.abody;

            var csorted = [].concat(ctablebody).filter((fitem) => {
                var foundobj = false;
                for (var j = 0; j < Object.keys(fitem).length; j++) {
                    var cftxt = (typeof fitem[j] === "object"?(fitem[j].text!==undefined?fitem[j].text:""):fitem[j]);
                    if(cftxt.toLowerCase().includes(ctxt.toLowerCase())){
                        foundobj = true;
                    } 
                }
                return (foundobj === true?fitem:null);
            });
            this.setState({
                ctablebody: csorted
            });
            setTimeout(() => {
                this.setPage(1,false); 
            }, 200);    
        }
    }
    //handle row click
    handleTrowClick = (cidx) => {
        if(this.props.handleRowClick !== undefined){
            this.props.handleRowClick(cidx);
        }
    }

    render() {
        //table headers
        var cheaders = (this.state.ctableheaders?(this.state.ctableheaders.map((chead,hidx) => {
            return <th key={hidx}>{chead} {chead!==""?<>
            <span onClick={e => this.handleTableSort(hidx,"ASC")}><ChevronUpIcon/></span>
            <span onClick={e => this.handleTableSort(hidx,"DESC")}><ChevronDownIcon/></span></>:<></>}</th>;
        })):<></>);
        //sort options
        var csortlist = (this.state.ctableheaders?(this.state.ctableheaders.map((chead,oidx) => {
            return <option key={oidx} value={oidx} className={chead===""?"d-none":""}>{chead}</option>;
        })):<></>);
        //tbody data
        var cviewdata = (this.props.pagetype&&this.props.pagetype==="page"?this.state.pageItemsList:this.state.ctablebody);
        
        //export data
        var exportdata = [];
        exportdata.push(this.state.ctableheaders);
        cviewdata.forEach(cbody => {
            var cobj = Object.keys(cbody).map((sidx) =>{
                return (typeof cbody[sidx] === "object"?(cbody[sidx].type==="image"?"":cbody[sidx].type==="status"?cbody[sidx].text:cbody[sidx]):cbody[sidx]);
            });
            exportdata.push(cobj);
        });
        //table view
        var cbody = (cviewdata?(cviewdata.map((cbody,bidx) => {
            return <tr key={bidx} onClick={e => this.handleTrowClick(bidx)}>
                {Object.keys(cbody).map((sidx) =>{
                    return <td key={sidx} className={typeof cbody[sidx] === "object"?(cbody[sidx].type==="image"?"text-center":""):""}>{typeof cbody[sidx] === "object"?(cbody[sidx].type==="image"?
                    <img src={cbody[sidx].url} className={cbody[sidx].style?cbody[sidx].style:""} alt="" />:
                    cbody[sidx].type==="status"?
                    <Badge variant={cbody[sidx].variant}><DotFillIcon/> {cbody[sidx].text}</Badge>
                    :cbody[sidx].type==="color"?
                    <div className="color-label" style={{backgroundColor:(cbody[sidx].color?cbody[sidx].color:"#555")}}></div>
                    :cbody[sidx].type==="lbllist"?
                    <div className="" style={{}}>{
                        cbody[sidx].list.map((titem, tagindx) => (
                            <Badge style={{ margin: "2px" }} key={tagindx} variant={cbody[sidx].variant}>{titem}</Badge>
                        ))
                    }</div>
                    :<></>)
                    :cbody[sidx]}</td>;
                })}
            </tr>;
        })):<></>);
        //list view 
        var clistbody = (cviewdata?(cviewdata.map((cbody,bidx) => {
            return <ListGroup.Item key={bidx} onClick={e => this.handleTrowClick(bidx)}><Col style={{position:"relative",padding:"0px"}}>
                 {Object.keys(cbody).map((sidx, scidx) =>{
                    return <div key={scidx} className={(scidx > 1?"small-content ":"")+(typeof cbody[sidx] === "object"?(cbody[sidx].type==="image"?"text-center":""):"")}>{typeof cbody[sidx] === "object"?(cbody[sidx].type==="image"?
                    <></>: cbody[sidx].type==="status"?
                    <Badge variant={cbody[sidx].variant}><DotFillIcon size={10}/> {cbody[sidx].text}</Badge>
                    :cbody[sidx].type==="color"?
                    <div className="color-label" style={{backgroundColor:(cbody[sidx].color?cbody[sidx].color:"#555")}}></div>
                    :cbody[sidx].type==="lbllist"?
                    <div className="" style={{marginTop:"5px"}}>{
                        cbody[sidx].list.map((titem, tagindx) => (
                            <Badge style={{ margin: "2px", position:"relative" }} key={tagindx} variant={cbody[sidx].variant}>{titem}</Badge>
                        ))
                    }</div>
                    :<></>)
                    :cbody[sidx]}</div>;
                })}
            </Col></ListGroup.Item>;
        })):<></>);
        //console.log(clistbody);

        //pagecounts
        var cpcount = (this.props.pagecount?this.props.pagecount:this.state.defaultPageCount);
        var ptotalresults = (this.props.totalresults?this.props.totalresults:0);
        var pstartcount = (this.state.currentPage > 1?((cpcount * (this.state.currentPage - 1))):1);
        var pendcount = (ptotalresults > (cpcount * this.state.currentPage)?((cpcount * this.state.currentPage)):ptotalresults);
        
        return (<>
            <Col className="filter-form form-inline">
                {this.props.showfilters?<>
                <label className="filter-label">Search</label>
                <Form.Control placeholder="Search" onKeyUp={e => this.handleTableSearch(e,"enter")}/>
                <label className="filter-label">Filter by</label>
                <Form.Control as="select">
                    <option value="">All</option>
                    {csortlist}
                </Form.Control>
                <Button type="button" variant="warning" className="search-link" onClick={e => this.handleTableSearch(e,"click")}>Search</Button>
                </>:<></>}
                {this.props.showexport?<ExportCSV csvData={exportdata} fileName="exportfile_test"/>:<></>}
            </Col>
            {this.props.showfilters?
            <Col className="filter-tags div-con d-none">
                <Button variant="warning">Company Name <XIcon size="14"/></Button>
                <Button variant="warning">Status <XIcon size="14"/></Button>
            </Col>
            :<></>}
            <Col xs={12} className="d-none d-sm-block" style={{padding:"0px"}}>
                <Table className="filter-table" hover size="sm">
                    <thead>
                        <tr>{cheaders}</tr>
                    </thead>
                    <tbody>{cbody}</tbody>
                </Table>
            </Col>
            <Col xs={12} className="d-block d-sm-none" style={{padding:"0px"}}>
                <ListGroup className="filter-list">{clistbody}</ListGroup>
            </Col>
            
            {this.props.showpaginate && this.state.pageItemsList.length > 0?<>
                <Badge variant="light" style={{color:"#142a33"}}>Showing {pstartcount} to {pendcount} of {ptotalresults} results</Badge>
                <Pagination>
                    <Pagination.Item onClick={() => this.setPage(1,true)} disabled={(this.state.currentPage === 1?true:false)}><ChevronLeftIcon/><ChevronLeftIcon/></Pagination.Item>
                    <Pagination.Item onClick={() => this.setPage((this.state.currentPage - 1),true)} disabled={(this.state.currentPage === 1?true:false)}><ChevronLeftIcon/></Pagination.Item>
                    <label>{this.state.currentPage} / {(this.state.totalPages?this.state.totalPages:0)}</label>
                    <Pagination.Item onClick={() => this.setPage((this.state.currentPage + 1),true)} disabled={(this.state.currentPage === this.state.totalPages?true:false)}><ChevronRightIcon/></Pagination.Item>
                    <Pagination.Item onClick={() => this.setPage(this.state.totalPages,true)} disabled={(this.state.currentPage === this.state.totalPages?true:false)}><ChevronRightIcon/><ChevronRightIcon/></Pagination.Item>
                </Pagination>

            </>:<></>}
        </>);
    }
}

function AcDropzoneComponent(props) {
    var cfileobj = props.updatedImage?{preview:props.updatedImage}:null;
    
    const [files, setFiles] = useState([]);
    const [previewImg, handleTogglePreview] = useState(false);

    const {getRootProps, getInputProps} = useDropzone({
        accept: (props.acceptTypes?props.acceptTypes:'image/*'),
        thumbnailWidth: 160,
        thumbnailHeight: 160,
        maxSize: 5242880, //max 5mb
        multiple: (props.multiple?true:false),
        onDrop: acceptedFiles => {
            if(acceptedFiles.length > 0){
                setFiles(acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })));
                if(props.handleDropImage){
                    props.handleDropImage(acceptedFiles);
                }
            }
        },
        onDropRejected: errarr => {
            if(errarr.length > 0){
                if(errarr[0].errors[0].code === "file-too-large"){
                    alertService.error("Image is larger than 5mb");
                }
            }
        }
    });

    var thumbs = <></>;
    if(files.length > 0){
        thumbs = files.map((file,fidx) => (
        <div key={fidx} className="thumb">
            <img src={file.preview} onClick={() => changeImagePreview(file)} alt="" />
        </div>
        ));   
    } else{
        if(cfileobj){
            thumbs = <div className="thumb">
                <img src={cfileobj.preview} onClick={() => changeImagePreview(cfileobj)} alt="" />
            </div>
        }
    }
    
    const changeImagePreview = (cobj) => {
        handleTogglePreview(cobj.preview);
    }
  
    useEffect(() => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);
  
    return (<>
        <section className="dropzone-container">
            <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            {props.showPreviews?
            <aside>
                {thumbs}
            </aside>:<></>}
        </section>
        <Modal show={previewImg} onHide={() => handleTogglePreview(!previewImg)}>
            <Modal.Body className="text-center">
                <span onClick={() => handleTogglePreview(false)} style={{position:"absolute",right:"15px",cursor:"pointer"}}><XCircleFillIcon size={20}/></span>
                <img src={previewImg} className="img-fluid" style={{minHeight:"25rem"}} alt=""/>
            </Modal.Body>
        </Modal>
    </>
      
    );
}

function AcLoadingModalComponent(props) {
    return (<Modal show={props.showmodal} className="centered" style={{width:"250px",marginTop:"calc(100vh / 3)"}}>
    <Modal.Body className="text-center">
        {props.message?<h4 style={{fontSize:"16px",width:"100%",left:"0px",position:"absolute"}}>{props.message}</h4>:<></>}
        <img src={loadinggif} className="img-fluid" alt=""/>
    </Modal.Body>
</Modal>);
}

export { AcButtonComponent, AcInputComponent, AcTableComponent, AcDropzoneComponent, AcLoadingModalComponent };
