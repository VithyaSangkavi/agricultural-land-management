import * as bcryptjs from "bcryptjs";
import _ from "lodash";
import { group } from "node:console";
import { AbstractRepository } from "typeorm";


async function abs(){
    // let salt = await bcryptjs.genSalt();
    // //get hash key
    // let hash = await bcryptjs.hash("1234", salt);
    // console.log(hash)

    let arr = new Array();
    arr.push({"make":"audi","year":"1666"})
    arr.push({"make":"audi","year":"552"})
    arr.push({"make":"fe","year":"55"})
    arr.push({"make":"fe","year":"55"})
    arr.push({"make":"ja","year":"55"})

    let gr = _.groupBy(arr,"make");

    for (const key in gr) {
        let abc = gr[key];
         for (const a of abc) {
             console.log(a)
         }
    }

    

}

abs();