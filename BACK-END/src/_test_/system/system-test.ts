import { CommonResponse } from "../../common/dto/common-response";
import { SystemServiceImpl } from "../../services/system/impl/system-service-impl";

describe("System Service layer Test", () => {
  
 test("System Health Check",async ()=>{

    let systemService:SystemServiceImpl = new SystemServiceImpl();
    let commonRes:CommonResponse = await systemService.systemHealth();
    // common response should not be null
    expect(commonRes).not.toBeNull();
    // status must be true
    expect(commonRes.isStatus()).toBe(true);

 })

});
