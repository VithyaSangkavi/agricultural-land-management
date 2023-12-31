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
  private workDate: string;

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
    this.workDate = body.workDate;

    if (body.startIndex && body.maxResult) {
      this.setStartIndex(body.startIndex);
      this.setMaxResult(body.maxResult);
    }
  }

  filViaDbObject(TaskCardModel: TaskCardEntity) {
    this.id = TaskCardModel.id;
    this.taskAssignedDate = TaskCardModel.taskAssignedDate;
    this.cardStatus = TaskCardModel.cardStatus;
    this.createdDate = TaskCardModel.createdDate;
    this.updatedDate = TaskCardModel.updatedDate;
    this.status = TaskCardModel.status;
    this.taskAssignedId = TaskCardModel.taskAssigned.id;
    this.workDate = TaskCardModel.workDate;
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

  public getCardStatus(): TaskCardStatus {
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

  public getWorkDate(): string {
    return this.workDate;
  }

  public setWorkDate(workDate: string): void {
    this.workDate = workDate;
  }
}
