import { getConnection } from "typeorm";
import { CommonResponse } from "../../common/dto/common-response";
import { FieldDto } from "../../dto/field/field-dto";
import { LoginUserInfo } from "../../dto/system-acsess/login-user";
import { FiledServiceImpl } from "../../services/field/impl/field-service-impl";

describe("Field Service Test ", () => {
  let fieldService: FiledServiceImpl = new FiledServiceImpl();

  test("check save filed", async () => {});
});
