import { alertService } from './alert.service';
import { basePath } from './common.service';
import { persistService } from './persist.service';
import { validateSets } from '../components/UiComponents/ValidateSets';

const submitCollection = {
    checkstat: { ptype: "GET", url: basePath+"/service/system/Health", queryparam: false, data: false },
    signin:{ ptype: "POST", url: basePath+"/service/login/signIn", queryparam: false, data: true },
    saveland: { ptype: "POST", url: basePath+"/service/master/landSave", queryparam: false, data:true, auth: true },
    manageland: { ptype: "GET", url: basePath+"/service/master/landFindAll", queryparam: false, data:true, auth: true },
    savelot: { ptype: "POST", url: basePath+"/service/master/lotSave", queryparam: false, data:true, auth: true },
    saveincome: { ptype: "POST", url: basePath+"/service/master/incomeSave", queryparam: false, data:true, auth: true },
    findalllot: { ptype: "GET", url: basePath+"/service/master/lotFindAll", queryparam: false, data:true, auth: true },
    managelot: { ptype: "GET", url: basePath+"/service/master/lotFindByLandId", queryparam: true, data:true, auth: true },
    getincomebyid: { ptype: "GET", url: basePath+"/service/master/incomeFindById", queryparam: true, data:true, auth: true },
    updateprice: { ptype: "PUT", url: basePath+"/service/master/updatePrice", queryparam: true, data:true, auth: true },
    getlandbyid: { ptype: "GET", url: basePath+"/service/master/landFind", queryparam: true, data:true, auth: true },


    login: { ptype: "POST", url: basePath+"/service/master/login", queryparam: false, data:true },

    updatepayment: { ptype: "POST", url: basePath+"/service/master/paymentUpdate", queryparam: true, data:true, auth: true },
    updateworker: { ptype: "POST", url: basePath+"/service/master/workerUpdate", queryparam: true, data:true, auth: true },
    saveworker: { ptype: "POST", url: basePath+"/service/master/workerSave", queryparam: false, data:true, auth: true },
    savepayment: { ptype: "POST", url: basePath+"/service/master/paymentSave", queryparam: false, data:true, auth: true },
    manageworker: { ptype: "POST", url: basePath+"/service/master/workerFindAll", queryparam: false, data:true, auth: true },
    saveexpense: { ptype: "POST", url: basePath+"/service/master/expenseSave", queryparam: false, data:true, auth: true },
    manageexpense: { ptype: "GET", url: basePath+"/service/master/expenseFindAll", queryparam: false, data:true, auth: true },
    savetasktype: { ptype: "POST", url: basePath+"/service/master/taskSave", queryparam: false, data:true, auth: true },
    findworkerbyland: { ptype: "POST", url: basePath+"/service/master/findWorkByLandId", queryparam: false, data:true, auth: true },
    findpaymentbyworkerid: { ptype: "GET", url: basePath+"/service/master/findByWorkerId", queryparam: true, data:true, auth: true },
}

const autoClose = true;
const keepAfterRouteChange = false;

function errorHandler(err, showalerts) {
    if (err !== undefined) {
        if(err&&err.message&&err.message.indexOf("401") > -1){
            persistService.persist({},true);
        }
        if (showalerts) {
            alertService.error(err, { autoClose, keepAfterRouteChange });
        }
    } else {
        if (showalerts) {
            alertService.error("Unrecognized error", { autoClose, keepAfterRouteChange });
        }
    }
}

function validateObj(vobj, cobj) {
    var cvarr = (vobj&&Object.keys(vobj).length>0?Object.keys(vobj).map((key) => { return [key, vobj[key]]; }):[]);
    
    if (cvarr !== undefined && cvarr.length > 0) {
        if (cobj !== undefined) {
            for (let i = 0; i < cvarr.length; i++) {
                if(cvarr[i][1] && cvarr[i][1].constructor === String){
                    if(cvarr[i][1] && cvarr[i][1] !== "" && cobj.hasOwnProperty(cvarr[i][0])){
                        var vresp = validateSets(cvarr[i][0], cvarr[i][1], cobj[cvarr[i][0]]);
                        if (vresp.validatestate !== null) {
                            return { status: false, msg: vresp.validatemsg };
                        }    
                    } else{
                        return {status:false,msg:"Required to fill "+cvarr[i][0]};
                    }
                } else if(cvarr[i][1] && cvarr[i][1].constructor === Object){
                    var coarr = (cvarr[i][1]&&Object.keys(cvarr[i][1]).length>0?Object.keys(cvarr[i][1]).map((key) => { return [key, cvarr[i][1][key]]; }):[]);
                    var cdobj = cobj[cvarr[i][0]];
                    for (let j = 0; j < coarr.length; j++) {
                        if(coarr[j][1] && coarr[j][1] !== "" && cdobj.hasOwnProperty(coarr[j][0])){
                            var voresp = validateSets(coarr[j][0], coarr[j][1], cdobj[coarr[j][0]]);
                            if (voresp.validatestate !== null) {
                                return { status: false, msg: voresp.validatemsg };
                            }    
                        } else{
                            return {status:false,msg:"Required to fill "+cvarr[i][0]};
                        }
                    }
                } else if(cvarr[i][1] && cvarr[i][1].constructor === Array){
                    var cvoarr = cvarr[i][1];
                    var cvoobj = (cobj[cvarr[i][0]]?cobj[cvarr[i][0]]:{});
                    
                    for (let l = 0; l < cvoarr.length; l++) {
                        var caoarr = [];
                        if(cvoarr[l]&&Object.keys(cvoarr[l]).length>0){
                            for (let key in cvoarr[l]) {
                                caoarr.push([key, cvoarr[l][key]]);
                            }    
                        }
                        var caoobj = cvoobj[l];
                        for (let j = 0; j < caoarr.length; j++) {
                            if(caoarr[j][1] && caoarr[j][1] !== "" && caoobj.hasOwnProperty(coarr[j][0])){
                                var varesp = validateSets(caoarr[j][0], caoarr[j][1], caoobj[coarr[j][0]]);
                                if (varesp.validatestate !== null) {
                                    return { status: false, msg: varesp.validatemsg };
                                }    
                            } else{
                                return {status:false,msg:"Required to fill "+cvarr[i][0]};
                            }
                        }
                    }
                }
            }
        } else {
            return { status: false, msg: "Data object not found" };
        }
    }
    return { status: true, msg: "" };
}

export { submitCollection, errorHandler, validateObj };