import { WorkAssignedDto } from "../dto/master/work-assigned-dto"
import { WorkAssignedEntity } from "../entity/master/work-assigned-entity";

export interface WorkAssignedDao {
  save(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity>;
  update(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity>;
  delete(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity>;
  findAll(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity[]>;
  findById(attendanceId: number): Promise<WorkAssignedEntity>;
  //findByName(name: String): Promise<WorkAssignedEntity>;
  findCount(workAssignedDto: WorkAssignedDto): Promise<number> ;
}