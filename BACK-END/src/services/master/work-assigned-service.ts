import { CommonResponse } from "../../common/dto/common-response";
import { WorkAssignedDto } from "../../dto/master/work-assigned-dto";

export interface WorkAssignedService {
  save(workAssignedDto: WorkAssignedDto): Promise<CommonResponse>;
  update(workAssignedDto: WorkAssignedDto): Promise<CommonResponse>;
  delete(workAssignedId: number): Promise<CommonResponse>;
  find(landId: number): Promise<CommonResponse>;
  findById(attendanceId: number): Promise<CommonResponse>;
  getDetailsByTaskAssignedId(taskAssignedId: number): Promise<CommonResponse>;
  // findByTaskAssignedId(taskAssignedId: number): Promise<CommonResponse>;
  
}