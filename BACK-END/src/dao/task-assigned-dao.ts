import { TaskAssignedDto } from "../dto/master/task-assigned-dto"
import { TaskAssignedEntity } from "../entity/master/task-assigned-entity";

export interface TaskAssignedDao {
  save(taskAssignedDto: TaskAssignedDto): Promise<TaskAssignedEntity>;
  update(taskAssignedDto: TaskAssignedDto): Promise<TaskAssignedEntity>;
  delete(taskAssignedDto: TaskAssignedDto): Promise<TaskAssignedEntity>;
  findAll(taskAssignedDto: TaskAssignedDto): Promise<TaskAssignedEntity[]>;
  findById(taskAssignedId: number): Promise<TaskAssignedEntity>;
  //findByName(taskName: String): Promise<TaskAssignedEntity>;
  findCount(taskAssignedDto: TaskAssignedDto): Promise<number> ;
}
