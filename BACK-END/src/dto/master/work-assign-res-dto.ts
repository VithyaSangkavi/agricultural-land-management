import { WorkAssignedEntity } from "../../entity/master/work-assigned-entity";


export class WorkAssignedResDto {
  private id: number;
  private quantity: number;
  private name: string;

  fillViaDbObject(workAssignedModel: WorkAssignedEntity) {
    this.id = workAssignedModel.id;
    this.quantity = workAssignedModel.quantity;
    this.name = workAssignedModel.worker.name;
  }

  public getAttendanceid(): number {
    return this.id;
  }

  public setAttendanceId(id: number): void {
    this.id = id;
  }
  
  public getQuantity(): number {
    return this.quantity;
  }

  public setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

}
