import { alertService } from './alert.service';
import { basePath } from './common.service';
import { persistService } from './persist.service';
import { validateSets } from '../components/UiComponents/ValidateSets';

const submitCollection = {
    checkstat: { ptype: "GET", url: basePath+"/service/system/Health", queryparam: false, data: false },
    signin:{ ptype: "POST", url: basePath+"/service/login/signIn", queryparam: false, data: true },
    
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