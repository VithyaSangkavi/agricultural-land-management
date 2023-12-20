import { Double } from "typeorm";
import { TaskExpenseDto } from "../dto/master/task-expense-dto";
import { TaskExpenseEntity } from "../entity/master/task-expense-entity";
import { TaskTypeEntity } from "../entity/master/task-type-entity";
import { ExpensesEntity } from "../entity/master/expense-entity";
import { TaskAssignedEntity } from "../entity/master/task-assigned-entity";

export interface TaskExpenseDao {
  save(taskExpenseDto: TaskExpenseDto, taskTypeModel: TaskTypeEntity, expenseModel: ExpensesEntity, taskAssignedModel:TaskAssignedEntity): Promise<TaskExpenseEntity>;
  update(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity>;
  delete(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity>;
  findAll(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity[]>;
  findById(taskExpenseId: number): Promise<TaskExpenseEntity>;
  findByName(value: Double): Promise<TaskExpenseEntity>; //not sure
  findCount(taskExpenseDto: TaskExpenseDto): Promise<number> ;
  findByExpenseId(expenseId: number): Promise<TaskExpenseEntity[]>;
  findByTaskAssignedId(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity[]>;
}