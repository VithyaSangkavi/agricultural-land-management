import { TaskAssignedDto } from "../dto/master/task-assigned-dto"
import { LandEntity } from "../entity/master/land-entity";
import { TaskAssignedEntity } from "../entity/master/task-assigned-entity";
import { TaskTypeEntity } from "../entity/master/task-type-entity";
import {Status} from "../enum/Status"

export interface TaskAssignedDao {
  save(taskAssignedDto: TaskAssignedDto, landModel: LandEntity, taskTypeModel: TaskTypeEntity): Promise<TaskAssignedEntity>;
  update(taskAssignedDto: TaskAssignedDto): Promise<TaskAssignedEntity>;
  delete(taskAssignedDto: TaskAssignedDto): Promise<TaskAssignedEntity>;
  findAll(taskAssignedDto: TaskAssignedDto): Promise<TaskAssignedEntity[]>;
  findById(taskAssignedId: number): Promise<TaskAssignedEntity>;
  findByName(status: Status): Promise<TaskAssignedEntity>;
  findCount(taskAssignedDto: TaskAssignedDto): Promise<number> ;
  findByTaskId(taskId: number): Promise<TaskAssignedEntity | null>;
}
