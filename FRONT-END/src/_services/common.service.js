
//import { store } from '../store/store';

const basePath = process.env.REACT_APP_BASEPATH; //cp.monoroc.com/back
const cversion = "1.0.0";
const langList = [{code:"en",text:"English (US)"},{code:"ta",text:"Tamil"},{code:"ar",text:"Arabic"}];
const pageLength = 10;
const alertTimeout = 2500;
const btnPressedKeyCode = 13;
const persistRootName = "pgo";
const usrRoles = {CM:"CHAIN_MANAGER",PA:"PLANIGO_ADMIN",SM:"STORE_MANAGER"};

function getPager(totalItems, currentPage, pageSize) {
    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    var startPage, endPage;
    if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
    } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
            startPage = 1;
            endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
    }

    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    var pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
}

function convertDateTime(MyDate_String_Value) {
    if (MyDate_String_Value) {
        var value = new Date(MyDate_String_Value);
        value.toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
        var dat = value.getFullYear() + "-" + ('0' + (value.getMonth() + 1)).slice(-2) + "-" + ('0' + (value.getDate())).slice(-2) + " " + ('0' + value.getHours()).slice(-2) + ":" + ('0' + value.getMinutes()).slice(-2) + ":" + ('0' + value.getSeconds()).slice(-2);
        return dat;
    } else {
        return "-";
    }
}

function convertDate(MyDate_String_Value) {
    var value = new Date(MyDate_String_Value);
    value.toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
    var dat = value.getFullYear() + "-" + ('0' + (value.getMonth() + 1)).slice(-2) + "-" + ('0' + (value.getDate())).slice(-2);
    return dat;
}

function convertTime(MyDate_String_Value) {
    var value = new Date(MyDate_String_Value);
    value.toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
    var hours = value.getHours(); var minutes = value.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

function camelizeTxt(str) {
	if(str != null){
		return str.split(' ').map(function(word,index){
		  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		}).join(' ');
	} else{
		return '';
	}
}

function objToQueryParam(obj) {
    var cstr = '?';
    var idx = 0;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            cstr += key + "=" + obj[key] + (idx > 0 ? "&&" : "");
        }
        idx++;
    }
    return cstr;
}

//check access for user roles
const grantPermission = (requestedRoles) => {
    //var newState =store.getState();
    //console.log(newState);
    const permittedRoles =  [usrRoles.CM];
    
    var checkfltrlist = (permittedRoles?permittedRoles.filter(x => (requestedRoles && requestedRoles.includes(x))):[]);
    return (requestedRoles?(checkfltrlist && checkfltrlist.length>0?true:false):true);
};

export { pageLength, getPager, convertDateTime, convertDate, convertTime, camelizeTxt, grantPermission, usrRoles, alertTimeout, basePath, cversion, objToQueryParam, btnPressedKeyCode, langList, persistRootName};
