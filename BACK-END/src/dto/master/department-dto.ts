import { DepartmentEntity } from "../../entity/master/department-entity";
import { PaginationDto } from "../pagination-dto";

export class DepartmentDto extends PaginationDto {
  private departmentId: number;
  private name: string;
  private color: string;

  filViaRequest(body) {
    
    if (body.departmentId) {
      this.departmentId = body.departmentId;
    }
    this.name = body.name;
    this.color = body.color;
    if (body.startIndex && body.maxResult) {
      this.setStartIndex(body.startIndex);
      this.setMaxResult(body.maxResult);
    }
  }

  filViaDbObject(departmentModel: DepartmentEntity) {
    this.departmentId = departmentModel.id;
    this.name = departmentModel.name;
    this.color = departmentModel.color;
  }

  public getDepartmentId(): number {
    return this.departmentId;
  }

  public setDepartmentId(departmentId: number): void {
    this.departmentId = departmentId;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getColor(): string {
    return this.color;
  }

  public setColor(color: string): void {
    this.color = color;
  }
}
