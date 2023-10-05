import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/Status";
import { TaskTypeEntity } from "../../entity/master/task-type-entity";

export class TaskTypeDto extends PaginationDto {
  private id: number;
  private taskName: string;
  private createdDate: Date;
  private updatedDate: Date;
  private status: Status;
  private cropId: number;

  filViaRequest(body) {
    
    if (body.id) {
      this.id = body.id;
    }
    this.taskName = body.taskName;
    this.createdDate = body.createdDate;
    this.updatedDate = body.updatedDate;
    this.status= body.status;
    this.cropId = body.crop.id;

    if (body.startIndex && body.maxResult) {
      this.setStartIndex(body.startIndex);
      this.setMaxResult(body.maxResult);
    }
  }

  filViaDbObject(TaskModel: TaskTypeEntity) {
    this.id = TaskModel.id;
    this.taskName = TaskModel.taskName;
    this.createdDate = TaskModel.createdDate;
    this.updatedDate = TaskModel.updatedDate;
    this.status = TaskModel.status;
    this.cropId = TaskModel.crop.id;  
  }

  public getTaskTypeId(): number {
    return this.id;
  }

  public setTaskTypeId(id: number): void {
    this.id = id;
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
