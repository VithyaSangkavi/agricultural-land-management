var systemRoutes = require("../routes/system-routes");
var masterRoutes = require("../routes/master-routes");
<<<<<<< HEAD
=======

>>>>>>> b56cffcac05be3fcbec3499b3e1d4e8d6a8a6a91

import express, { Request, Response, Router } from "express";

export class RouteConfiguration {
  configRoutes(app: express.Application) {
    app.use("/service/system", systemRoutes);
<<<<<<< HEAD

    app.use("/service/master", masterRoutes);
=======
    app.use("/service/master", masterRoutes); 
>>>>>>> b56cffcac05be3fcbec3499b3e1d4e8d6a8a6a91
   
  }

}
