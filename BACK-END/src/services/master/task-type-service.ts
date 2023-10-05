import { CommonResponse } from "../../common/dto/common-response";
import { TaskTypeDto } from "../../dto/master/task-type-dto";

export interface TaskTypeService {
  save(taskTypeDto: TaskTypeDto): Promise<CommonResponse>;
  update(taskTypeDto: TaskTypeDto): Promise<CommonResponse>;
  delete(taskTypeDto: TaskTypeDto): Promise<CommonResponse>;
  find(taskTypeDto: TaskTypeDto): Promise<CommonResponse>;
  findById(taskId: number): Promise<CommonResponse>;
}
