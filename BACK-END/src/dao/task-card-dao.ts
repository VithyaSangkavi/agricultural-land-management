import { TaskCardDto } from "../dto/master/task-card-dto";
import { TaskCardEntity } from "../entity/master/task-card-entity";

export interface TaskCardDao {
  save(taskCardDto: TaskCardDto): Promise<TaskCardEntity>;
  update(taskCardDto: TaskCardDto): Promise<TaskCardEntity>;
  delete(taskCardDto: TaskCardDto): Promise<TaskCardEntity>;
  findAll(taskCardDto: TaskCardDto): Promise<TaskCardEntity[]>;
  findById(taskCardId: number): Promise<TaskCardEntity>;
  findCount(TaskCardDto: TaskCardDto): Promise<number> ;
}
