import { WorkAssignedEntity } from "../../entity/master/work-assigned-entity";
import { PaginationDto } from "../pagination-dto";
import { Units } from "../../enum/units";
import { Status } from "../../enum/status";
import { TaskStatus } from "../../enum/taskStatus";
import { Double } from "typeorm";


export class WorkeAssignedDto extends PaginationDto {
  private attendanceId: number;
  private quantity: Double;
  private units: Units;
  private startDate: Date;
  private endDate: Date;
  private createdDate: Date;
  private updatedDate: Date;
  private status: Status;
  private taskStatus: TaskStatus;
  private workerId: number;
  private taskId: number;
  private lotId: number;

  filViaRequest(body) {
    
    if (body.attendanceId) {
      this.attendanceId = body.attendanceId;
    }
    this.quantity = body.quantity;
    this.units = body.units;
    this.startDate = body.startDate;
    this.endDate = body.endDate;
    this.createdDate = body.createdDate;
    this.updatedDate = body.updatedDate;
    this.status= body.status;
    this.taskStatus = body.taskStatus;
    this.workerId = body.workerId;
    this.taskId = body.taskId;
    this.lotId = body.lotId;


    if (body.startIndex && body.maxResult) {
      this.setStartIndex(body.startIndex);
      this.setMaxResult(body.maxResult);
    }
  }

  filViaDbObject(workAssignedModel: WorkAssignedEntity) {
    this.attendanceId = workAssignedModel.attendanceId;
    this.quantity = workAssignedModel.quantity;
    this.units = workAssignedModel.units;
    this.startDate = workAssignedModel.startDate;
    this.endDate = workAssignedModel.endDate;
    this.createdDate = workAssignedModel.createdDate;
    this.updatedDate = workAssignedModel.updatedDate;
    this.status = workAssignedModel.status;
    this.taskStatus = workAssignedModel.taskStatus;
    this.workerId = workAssignedModel.workerId;
    this.taskId = workAssignedModel.taskId;
    this.lotId = workAssignedModel.lotId;  
  }

  public getAttendanceId(): number {
    return this.attendanceId;
  }

  public setAttendanceId(attendanceId: number): void {
    this.attendanceId = attendanceId;
  }
  
  public getQuantity(): Double {
    return this.quantity;
  }

  public setQuantity(quantity: Double): void {
    this.quantity = quantity;
  }

  public getUnits(): Units {
    return this.units;
  }

  public setUnits(units: Units): void {
    this.units = units;
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

  public getTaskStatus(): TaskStatus {
    return this.taskStatus;
  }

  public setTaskStatus(taskStatus: TaskStatus): void {
    this.taskStatus = taskStatus;
  }

  public getworkerId(): number {
    return this.workerId;
  }

  public setworkerId(workerId: number): void {
    this.workerId = workerId;
  }

  public getTaskId(): number {
    return this.taskId;
  }

  public setTaskId(taskId: number): void {
    this.taskId = taskId;
  }

  public getLotId(): number {
    return this.lotId;
  }

  public setLotId(lotId: number): void {
    this.lotId = lotId;
  }
  
}
