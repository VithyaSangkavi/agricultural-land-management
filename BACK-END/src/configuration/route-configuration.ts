var systemRoutes = require("../routes/system-routes");


import express, { Request, Response, Router } from "express";

export class RouteConfiguration {
  configRoutes(app: express.Application) {
    app.use("/service/system", systemRoutes);
   
  }

}
