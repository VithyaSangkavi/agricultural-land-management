import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/Status";
import { TaskAssignedEntity } from "../../entity/master/task-assigned-entity";

export class TaskAssignedDto extends PaginationDto {
  private id: number;
  private startDate: Date;
  private endDate: Date;
  private status: Status;
  private landId: number;
  private taskId: number;

  filViaRequest(body) {
    
    if (body.id) {
      this.id = body.id;
    }
    this.startDate = body.startDate;
    this.endDate = body.endDate;
    this.status= body.status;
    this.landId = body.task.id;
    this.taskId = body.expense.id;

    if (body.startIndex && body.maxResult) {
      this.setStartIndex(body.startIndex);
      this.setMaxResult(body.maxResult);
    }
  }

  filViaDbObject(TaskAssignedModel: TaskAssignedEntity) {
    this.id = TaskAssignedModel.id;
    this.startDate = TaskAssignedModel.startDate;
    this.endDate = TaskAssignedModel.endDate;
    this.status = TaskAssignedModel.status;
    this.landId = TaskAssignedModel.land.id;  
    this.taskId = TaskAssignedModel.task.id;
  }

  public getTaskAssignedId(): number {
    return this.id;
  }

  public setTaskAssignedId(id: number): void {
    this.id = id;
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public setStartDate(startDate: Date): void {
    this.startDate = startDate;
  }

  public getEndDate(): Date {
    return this.endDate;
  }

  public setEndDate(endDate: Date): void {
    this.endDate = endDate;
  }

  public getStatus(): Status {
    return this.status;
  }

  public setStatus(status: Status): void {
    this.status = status;
  }

  public getLandId(): number {
    return this.landId;
  }

  public setLandId(landId: number): void {
    this.landId = landId;
  }

  public getTaskId(): number {
    return this.taskId;
  }

  public setTaskId(taskId: number): void {
    this.taskId = taskId;
  }
}
