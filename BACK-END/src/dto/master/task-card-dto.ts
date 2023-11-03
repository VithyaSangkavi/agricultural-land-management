import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/Status";
import { TaskCardStatus } from "../../enum/taskCardStatus";
import { TaskCardEntity } from "../../entity/master/task-card-entity";

export class TaskCardDto extends PaginationDto {
  private id: number;
  private taskAssignedDate: Date;
  private cardStatus: TaskCardStatus;
  private createdDate: Date;
  private updatedDate: Date;
  private status: Status;
  private taskAssignedId: number;

  filViaRequest(body) {
    
    if (body.id) {
      this.id = body.id;
    }
    this.taskAssignedDate = body.taskAssignedDate;
    this.cardStatus = body.cardStatus;
    this.createdDate = body.createdDate;
    this.updatedDate = body.updatedDate;
    this.status= body.status;
    this.taskAssignedId = body.taskAssignedId;

    if (body.startIndex && body.maxResult) {
      this.setStartIndex(body.startIndex);
      this.setMaxResult(body.maxResult);
    }
  }

  filViaDbObject(TaskAssignedModel: TaskCardEntity) {
    this.id = TaskAssignedModel.id;
    this.taskAssignedDate = TaskAssignedModel.taskAssignedDate;
    this.cardStatus = TaskAssignedModel.cardStatus;
    this.createdDate = TaskAssignedModel.createdDate;
    this.updatedDate = TaskAssignedModel.updatedDate;
    this.status = TaskAssignedModel.status;
    this.taskAssignedId = TaskAssignedModel.taskAssigned.id;
  }

  public getTaskCardId(): number {
    return this.id;
  }

  public setTaskCardId(id: number): void {
    this.id = id;
  }

  public getTaskAssignedDate(): Date {
    return this.taskAssignedDate;
  }

  public setTaskAssignedDate(taskAssignedDate: Date): void {
    this.taskAssignedDate = taskAssignedDate;
  }

  public getcardStatus(): TaskCardStatus {
    return this.cardStatus;
  }

  public setCardStatus(cardStatus: TaskCardStatus): void {
    this.cardStatus = cardStatus;
  }

  public getCreatedDate(): Date {
    return this.createdDate;
  }

  public setCreatedDate(createdDate: Date): void {
    this.createdDate = createdDate;
  }

  public getUpdatedDate(): Date {
    return this.updatedDate;
  }

  public setUpdatedDate(updatedDate: Date): void {
    this.updatedDate = updatedDate;
  }
 
  public getStatus(): Status {
    return this.status;
  }

  public setStatus(status: Status): void {
    this.status = status;
  }

  public getTaskAssignedId(): number {
    return this.taskAssignedId;
  }

  public setTaskAssignedId(taskAssignedId: number): void {
    this.taskAssignedId = taskAssignedId;
  }
}
