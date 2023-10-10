import { TaskTypeDto } from "../dto/master/task-type-dto"
import { CropEntity } from "../entity/master/crop-entity";
import { TaskTypeEntity } from "../entity/master/task-type-entity";

export interface TaskTypeDao {
  save(taskTypeDto: TaskTypeDto, cropModel: CropEntity): Promise<TaskTypeEntity>;
  update(taskTypeDto: TaskTypeDto): Promise<TaskTypeEntity>;
  delete(taskTypeDto: TaskTypeDto): Promise<TaskTypeEntity>;
  findAll(taskTypeDto: TaskTypeDto): Promise<TaskTypeEntity[]>;
  findById(taskId: number): Promise<TaskTypeEntity>;
  findByName(taskName: String): Promise<TaskTypeEntity>;
  findCount(taskTypeDto: TaskTypeDto): Promise<number> ;
}
