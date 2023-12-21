import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/Status";
import { TaskExpenseEntity } from "../../entity/master/task-expense-entity";

export class TaskExpenseDto extends PaginationDto {
  private id: number;
  private value: number;
  private createdDate: Date;
  private updatedDate: Date;
  private status: Status;
  private taskId: number;
  private expenseId: number;
  private taskAssignedId: number;
  private expenseType: string;


  filViaRequest(body) {
    
    if (body.id) {
      this.id = body.id;
    }
    this.value = body.value;
    this.createdDate = body.createdDate;
    this.updatedDate = body.updatedDate;
    this.status= body.status;
    this.taskId = body.taskId;
    this.expenseId = body.expenseId;
    this.taskAssignedId = body.taskAssignedId;


    if (body.startIndex && body.maxResult) {
      // this.setStartIndex(body.startIndex);
      // this.setMaxResult(body.maxResult);
    }
  }

  filViaDbObject(TaskExpenseModel: TaskExpenseEntity) {
    this.id = TaskExpenseModel.id;
    this.value = TaskExpenseModel.value;
    this.taskId = TaskExpenseModel.taskType.id;  
    this.expenseId = TaskExpenseModel.expense.id;
    this.taskAssignedId = TaskExpenseModel.taskAssigned.id;
  }

  filViaDbObjectForTaskExpense(TaskExpenseModel: any) {
    this.id = TaskExpenseModel.id;
    this.value = TaskExpenseModel.value;
    this.expenseId = TaskExpenseModel.expenseId;
    this.expenseType = TaskExpenseModel.expenseType;
  }

  public getTaskExpenseId(): number {
    return this.id;
  }

  public setTaskExpenseId(id: number): void {
    this.id = id;
  }

  public getValue(): number {
    return this.value;
  }

  public setValue(value: number): void {
    this.value = value;
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

  public getTaskId(): number {
    return this.taskId;
  }

  public setTaskId(taskId: number): void {
    this.taskId = taskId;
  }

  public getExpenseId(): number {
    return this.expenseId;
  }

  public setExpenseId(expenseId: number): void {
    this.expenseId = expenseId;
  }

  public getTaskAssignedId(): number {
    return this.taskAssignedId;
  }

  public setTaskAssignedId(taskAssignedId: number): void {
    this.taskAssignedId = taskAssignedId;
  }

  public getExpenseType(): string {
    return this.expenseType;
  }

  public setExpenseType(expenseType: string): void {
    this.expenseType = expenseType;
  }
}
