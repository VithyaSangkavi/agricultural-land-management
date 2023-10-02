import { CommonResponse } from "../common/dto/common-response";
import { CodesRes } from "./codes-sup";

export class CommonResSupport {
  public static getSuccessResponse(msg: string): CommonResponse {
    let cr: CommonResponse = new CommonResponse();
    cr.setStatus(true);
    cr.setExtra(msg);
    return cr;
  }
  public static getErrorResponse(extra: any, code: string): CommonResponse {
    let cr: CommonResponse = new CommonResponse();
    cr.setStatus(false);
    cr.setExtra(extra);
    cr.setCode(code);
    return cr;
  }
  public static getValidationException(extra: any): CommonResponse {
    let cr: CommonResponse = new CommonResponse();
    cr.setStatus(false);
    cr.setExtra(extra);
    cr.setCode(CodesRes.validationError);
    return cr;
  }
}
