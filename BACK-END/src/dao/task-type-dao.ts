import { TaskDto } from "../dto/master/task-type-dto"
import { TaskTypeEntity } from "../entity/master/task-type-entity";

export interface TaskTypeDao {
  save(taskDto: TaskDto): Promise<TaskTypeEntity>;
  update(taskDto: TaskDto): Promise<TaskTypeEntity>;
  delete(taskDto: TaskDto): Promise<TaskTypeEntity>;
  findAll(taskDto: TaskDto): Promise<TaskTypeEntity[]>;
  findById(taskId: number): Promise<TaskTypeEntity>;
  findByName(taskName: String): Promise<TaskTypeEntity>;
  findCount(taskDto: TaskDto): Promise<number> ;
}
