import { CommonResponse } from "../../common/dto/common-response";
import { TaskDto } from "../../dto/master/task-dto";

export interface TaskService {
  save(taskDto: TaskDto): Promise<CommonResponse>;
  update(taskDto: TaskDto): Promise<CommonResponse>;
  delete(taskDto: TaskDto): Promise<CommonResponse>;
  find(taskDto: TaskDto): Promise<CommonResponse>;
  findById(taskId: number): Promise<CommonResponse>;
}
