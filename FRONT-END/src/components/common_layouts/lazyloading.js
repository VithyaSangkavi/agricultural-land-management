import React, { useEffect } from 'react'; //useState, 

//import { submitCollection } from '../../_services/submit.service';
//import { nsyncSubmitSets } from '../UiComponents/SubmitSets';
//import {persistService} from '../../_services/persist.service';

/* function getProdInformation(pdata) {
    const sobj = {isReqPagination:false, withImageUrl: true};
    var getcurrentdata = (pdata&&pdata["prodlist"]?pdata["prodlist"]:false);
    
    return new Promise((resolve) => {
        if(getcurrentdata){
            resolve(getcurrentdata);
        } else{
            nsyncSubmitSets(submitCollection.searchProds,sobj,false).then((results) => {
                if(results&&results.extra){
                    persistService.persist(results.extra,false,"prodlist");
                    resolve(results.extra);
                } else{
                    resolve([]);
                }
            });    
        }
    });   
} */
    
export default function LazyLoading(props) {
    //const [prodInformation, setProdInformation] = useState({});
    //const persistdata = persistService.loadPersist();
    
    useEffect(() => {
        /* getProdInformation(persistdata).then(data => {
            props.setProdList(data);
            setProdInformation(data)
        }); */
    }, []);
  
    return(<></>)
  }