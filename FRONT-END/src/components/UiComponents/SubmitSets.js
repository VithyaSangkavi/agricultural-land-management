import axios from 'axios';
import { alertService } from '../../_services/alert.service';
import {errorHandler} from '../../_services/submit.service';
//import {persistService} from '../../_services/persist.service';
import { store } from '../../store/store';

async function submitSets (callstat,cobj,showalerts, newheaders){
    const csubObj = callstat; 

    //get signin object
    var storestat = store.getState();
    var cuobj = (storestat.signState&&storestat.signState.signinDetails?storestat.signState.signinDetails:null);   
    var checknewheaders = (newheaders?newheaders:{});
    const coheaders = (csubObj.auth&&cuobj&&cuobj.token?{...checknewheaders, Authorization: 'Bearer '+cuobj.token}:{});

    if(csubObj !== undefined && Object.keys(csubObj).length > 0){
        try {
            var res = await axios({method: csubObj.ptype,url: csubObj.url+(csubObj.queryparam&&cobj?cobj:""),data: (csubObj.ptype!=="GET"?cobj:""),headers:coheaders});
            if(res.status === 200){
                //alertService.success("Data loaded", { autoClose, keepAfterRouteChange });
                return (res.data!==undefined?res.data:false);
            }
        } catch (error) {
            errorHandler(error,showalerts);
            return false;
        }
    } else{
        if(showalerts){
            alertService.error("Cannot find requested call");
        }
        return false;
    }
    
}

async function nsyncSubmitSets (callstat,cobj,showalerts){ 
    const csubObj = callstat; 

    //get signin object
    var storestat = store.getState();
    var cuobj = (storestat.signState&&storestat.signState.signinDetails?storestat.signState.signinDetails:null);   
    
    const coheaders = (csubObj.auth&&cuobj&&cuobj.token?{Authorization: 'Bearer '+cuobj.token}:{});

    if(csubObj !== undefined && Object.keys(csubObj).length > 0){
        try {
            var res = await axios({method: csubObj.ptype,url: csubObj.url+(csubObj.queryparam&&cobj?cobj:""),data: (csubObj.ptype==="POST"?cobj:""),headers:coheaders});
            if(res.status === 200){
                return (res.data!==undefined?res.data:false);
            }    
        } catch (error) {
            errorHandler(error,showalerts);
            return (false);
        }
    } else{
        if(showalerts){
            alertService.error("Cannot find requested call");
        }
        return (false);
    }
}

export { submitSets, nsyncSubmitSets };