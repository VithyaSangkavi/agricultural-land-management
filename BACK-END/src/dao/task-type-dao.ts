import { TaskTypeDto } from "../dto/master/task-type-dto"
import { TaskTypeEntity } from "../entity/master/task-type-entity";

export interface TaskTypeDao {
  save(taskTypeDto: TaskTypeDto): Promise<TaskTypeEntity>;
  update(taskTypeDto: TaskTypeDto): Promise<TaskTypeEntity>;
  delete(taskTypeDto: TaskTypeDto): Promise<TaskTypeEntity>;
  findAll(taskTypeDto: TaskTypeDto): Promise<TaskTypeEntity[]>;
  findById(taskId: number): Promise<TaskTypeEntity>;
  findByName(taskName: String): Promise<TaskTypeEntity>;
  findCount(taskTypeDto: TaskTypeDto): Promise<number> ;
}
