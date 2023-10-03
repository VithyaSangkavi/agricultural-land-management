import { TaskDto } from "../dto/master/task-dto"
import { TaskEntity } from "../entity/master/task-entity";

export interface TaskDao {
  save(taskDto: TaskDto): Promise<TaskEntity>;
  update(taskDto: TaskDto): Promise<TaskEntity>;
  delete(taskDto: TaskDto): Promise<TaskEntity>;
  findAll(taskDto: TaskDto): Promise<TaskEntity[]>;
  findById(taskId: number): Promise<TaskEntity>;
  findByName(taskName: String): Promise<TaskEntity>;
  findCount(taskDto: TaskDto): Promise<number> ;
}
