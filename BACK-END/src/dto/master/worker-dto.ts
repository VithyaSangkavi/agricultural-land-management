import { WorkerEntity } from "../../entity/master/worker-entity";
import { PaginationDto } from "../pagination-dto";
import { WorkerStatus } from "../../enum/workerStatus";
import { Status } from "../../enum/status";

export class WorkerDto extends PaginationDto {
  private workerId: number;
  private name: string;
  private dob: Date;
  private nic: string;
  private gender: string;
  private joinedDate: Date;
  private phone: string;
  private address: string;
  private workerStatus: WorkerStatus;
  private createdDate: Date;
  private updatedDate: Date;
  private status: Status;
  private landId: number;

  filViaRequest(body) {
    
    if (body.workerId) {
      this.workerId = body.workerId;
    }
    this.name = body.name;
    this.dob = body.dob;
    this.nic = body.nic;
    this.gender = body.gender;
    this.joinedDate = body.joinedDate;
    this.phone = body.phone;
    this.address = body.address;
    this.workerStatus = body.workerStatus;
    this.createdDate = body.createdDate;
    this.updatedDate = body.updatedDate;
    this.status= body.status;
    this.landId = body.landId;


    if (body.startIndex && body.maxResult) {
      this.setStartIndex(body.startIndex);
      this.setMaxResult(body.maxResult);
    }
  }

  filViaDbObject(workerModel: WorkerEntity) {
    this.workerId = workerModel.workerId;
    this.name = workerModel.name;
    this.dob = workerModel.dob;
    this.nic = workerModel.nic;
    this.gender = workerModel.gender;
    this.joinedDate = workerModel.joinedDate;
    this.phone = workerModel.phone;
    this.address = workerModel.address;
    this.workerStatus = workerModel.workerStatus;
    this.createdDate = workerModel.createdDate;
    this.updatedDate = workerModel.updatedDate;
    this.status = workerModel.status;
    this.landId = workerModel.landId;  
  }

  public getworkerId(): number {
    return this.workerId;
  }

  public setworkerId(workerId: number): void {
    this.workerId = workerId;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getNic(): string {
    return this.nic;
  }

  public setNic(nic: string): void {
    this.nic = nic;
  }

  public getGender(): string {
    return this.gender;
  }

  public setGender(gender: string): void {
    this.gender = gender;
  }

  public getJoinedDate(): Date {
    return this.joinedDate;
  }

  public setJoinedDate(joinedDate: Date): void {
    this.joinedDate = joinedDate;
  }

  public getPhone(): string {
    return this.phone;
  }

  public setPhone(phone: string): void {
    this.phone = phone;
  }

  public getAddress(): string {
    return this.address;
  }

  public setAddress(address: string): void {
    this.address = address;
  }

  public getWorkerStatus(): WorkerStatus {
    return this.workerStatus;
  }

  public setWorkerStatus(workerStatus: WorkerStatus): void {
    this.workerStatus = workerStatus;
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

  public getLandId(): number {
    return this.landId;
  }

  public setLandId(landId: number): void {
    this.landId = landId;
  }
}