import { WorkAssignedDto } from "../dto/master/work-assigned-dto"
import { LotEntity } from "../entity/master/lot-entity";
import { TaskAssignedEntity } from "../entity/master/task-assigned-entity";
import { TaskCardEntity } from "../entity/master/task-card-entity";
import { TaskTypeEntity } from "../entity/master/task-type-entity";
import { WorkAssignedEntity } from "../entity/master/work-assigned-entity";
import { WorkerEntity } from "../entity/master/worker-entity";
import { TaskStatus } from "../enum/taskStatus";
import { IWorkerAssignedInfoFromDao } from "../types/worker-assignedt-types";

export interface WorkAssignedDao {
  save(workAssignedDto: WorkAssignedDto, workerModel: WorkerEntity, taskTypeModel: TaskTypeEntity, lotModel: LotEntity, taskAssignedModel: TaskAssignedEntity, taskCardModel: TaskCardEntity): Promise<WorkAssignedEntity>;
  update(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity>;
  delete(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity>;
  findAll(landId: number): Promise<IWorkerAssignedInfoFromDao[]>;
  findById(attendanceId: number): Promise<WorkAssignedEntity>;
  findByName(taskStatus: TaskStatus): Promise<WorkAssignedEntity>;
  findCount(landId: number): Promise<number> ;
  // findByTaskAssignedId(taskAssignedId: number): Promise<WorkAssignedEntity[]>;
  deleteByWorkerId(workerId: number): Promise<boolean>
}
