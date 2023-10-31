import { CommonResponse } from "../../common/dto/common-response";
import { WorkAssignedDto } from "../../dto/master/work-assigned-dto";

export interface WorkAssignedService {
  save(workAssignedDto: WorkAssignedDto): Promise<CommonResponse>;
  update(workAssignedDto: WorkAssignedDto): Promise<CommonResponse>;
  delete(workAssignedDto: WorkAssignedDto): Promise<CommonResponse>;
  find(landId: number): Promise<CommonResponse>;
  findById(attendanceId: number): Promise<CommonResponse>;
  getOngoingTasksWithTaskNames(): Promise<CommonResponse>;
}