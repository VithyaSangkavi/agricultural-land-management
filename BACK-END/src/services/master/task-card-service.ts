import { CommonResponse } from "../../common/dto/common-response";
import { TaskCardDto } from "../../dto/master/task-card-dto";

export interface TaskCardService {
  save(taskCardDto: TaskCardDto): Promise<CommonResponse>;
  update(taskCardDto: TaskCardDto): Promise<CommonResponse>;
  delete(taskCardDto: TaskCardDto): Promise<CommonResponse>;
  find(taskCardDto: TaskCardDto): Promise<CommonResponse>;
  findById(taskCardId: number): Promise<CommonResponse>;
}
