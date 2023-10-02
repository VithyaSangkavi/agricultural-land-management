import express, { Response } from "express";


/**
 * authentication middle ware
 */

module.exports = async (req: express.Request, res: express.Response, next) => {
  // check token and headers
  try {
    // // check authorization
    // if (req.headers.authorization) {
    //   let token = req.headers.authorization.split(" ")[1];

    //   // check valid token
    //   let loginUserInfo: LoginUserInfo = jwtHelper.verifyJwt(token);
      
    //   req.body.loginUserInfoJWT = loginUserInfo;
    //   next();
    // } else {
    //   res.sendStatus(401);
    // }
    next()
  } catch (error) {
    res.sendStatus(401);
  }
};
