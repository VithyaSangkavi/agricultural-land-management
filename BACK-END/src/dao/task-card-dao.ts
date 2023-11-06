import { TaskCardDto } from "../dto/master/task-card-dto";
import { TaskAssignedEntity } from "../entity/master/task-assigned-entity";
import { TaskCardEntity } from "../entity/master/task-card-entity";

export interface TaskCardDao {
  save(taskCardDto: TaskCardDto, taskAssignedModel: TaskAssignedEntity): Promise<TaskCardEntity>;
  update(taskCardDto: TaskCardDto, id: number): Promise<TaskCardEntity>;
  delete(taskCardDto: TaskCardDto): Promise<TaskCardEntity>;
  findAll(taskCardDto: TaskCardDto): Promise<TaskCardEntity[]>;
  findById(taskCardId: number): Promise<TaskCardEntity>;
  findCount(TaskCardDto: TaskCardDto): Promise<number> ;
  findTaskCardByTaskId(taskAssignedId: number): Promise<TaskCardEntity | null>;
}