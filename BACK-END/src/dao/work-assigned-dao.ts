import { WorkAssignedDto } from "../dto/master/work-assigned-dto"
import { LotEntity } from "../entity/master/lot-entity";
import { TaskAssignedEntity } from "../entity/master/task-assigned-entity";
import { TaskTypeEntity } from "../entity/master/task-type-entity";
import { WorkAssignedEntity } from "../entity/master/work-assigned-entity";
import { WorkerEntity } from "../entity/master/worker-entity";
import { TaskStatus } from "../enum/taskStatus";

export interface WorkAssignedDao {
  save(workAssignedDto: WorkAssignedDto, workerModel: WorkerEntity, taskTypeModel: TaskTypeEntity, lotModel: LotEntity, taskAssignedModel: TaskAssignedEntity): Promise<WorkAssignedEntity>;
  update(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity>;
  delete(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity>;
  findAll(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity[]>;
  findById(attendanceId: number): Promise<WorkAssignedEntity>;
  findByName(taskStatus: TaskStatus): Promise<WorkAssignedEntity>;
  findCount(workAssignedDto: WorkAssignedDto): Promise<number> ;
}
