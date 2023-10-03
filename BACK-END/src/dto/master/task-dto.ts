import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/status";
import { TaskEntity } from "../../entity/master/task-entity";

export class TaskDto extends PaginationDto {
  private taskId: number;
  private taskName: string;
  private createdDate: Date;
  private updatedDate: Date;
  private status: Status;
  private cropId: number;

  filViaRequest(body) {
    
    if (body.taskId) {
      this.taskId = body.taskId;
    }
    this.taskName = body.taskName;
    this.createdDate = body.createdDate;
    this.updatedDate = body.updatedDate;
    this.status= body.status;
    this.cropId = body.cropId;

    if (body.startIndex && body.maxResult) {
      this.setStartIndex(body.startIndex);
      this.setMaxResult(body.maxResult);
    }
  }

  filViaDbObject(TaskModel: TaskEntity) {
    this.taskId = TaskModel.taskId;
    this.taskName = TaskModel.taskName;
    this.createdDate = TaskModel.createdDate;
    this.updatedDate = TaskModel.updatedDate;
    this.status = TaskModel.status;
    this.cropId = TaskModel.cropId;  
  }

  public getTaskId(): number {
    return this.taskId;
  }

  public setTaskId(taskId: number): void {
    this.taskId = taskId;
  }

  public getTaskName(): string {
    return this.taskName;
  }

  public setTasktaskName(taskName: string): void {
    this.taskName = taskName;
  }

  public getcreatedDate(): Date {
    return this.createdDate;
  }

  public setcreatedDate(createdDate: Date): void {
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

  public getCropId(): number {
    return this.cropId;
  }

  public setCropId(cropId: number): void {
    this.cropId = cropId;
  }
}
