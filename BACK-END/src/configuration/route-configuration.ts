var systemRoutes = require("../routes/system-routes");
var masterRoutes = require("../routes/master-routes");



import express, { Request, Response, Router } from "express";

export class RouteConfiguration {
  configRoutes(app: express.Application) {

    app.use("/service/system", systemRoutes);

    app.use("/service/master", masterRoutes); 
   
  }

}
