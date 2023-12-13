import { CommonResponse } from "../../common/dto/common-response";
import { TaskAssignedDto } from "../../dto/master/task-assigned-dto";

export interface TaskAssignedService {
  save(taskAssignedDto: TaskAssignedDto): Promise<CommonResponse>;
  update(taskAssignedDto: TaskAssignedDto): Promise<CommonResponse>;
  delete(taskAssignedDto: TaskAssignedDto): Promise<CommonResponse>;
  find(taskAssignedDto: TaskAssignedDto): Promise<CommonResponse>;
  findById(taskAssignedId: number): Promise<CommonResponse>;
  findByTaskId(taskId: number): Promise<CommonResponse>;
  getOngoingTasksWithTaskNames(landId: number): Promise<CommonResponse>;
  getCompletedTasksWithTaskNames(landId: number): Promise<CommonResponse>;
  updateEndDate(taskAssignedId: number, endDate: Date, newStatus: string): Promise<CommonResponse>;
  updateStatus(taskAssignedId: number, newStatus: string): Promise<CommonResponse>;

}
