import express from "express";
import { LoginUserInfo } from "../dto/system-acsess/login-user";
import { ImageResolutionsTypes } from "../enum/image-resolution-type";
export class LoginUserInfoSup {
  static getLoginUserInfoFromReq(req: express.Request): LoginUserInfo {
    let loginUserDto:LoginUserInfo = req.body.loginUserInfoJWT;
    // loginUserDto.setUserId(1);
    // loginUserDto.setStoreId(1);
    // loginUserDto.setImageResolution(ImageResolutionsTypes.W100_100)
    return loginUserDto;
  }
}
