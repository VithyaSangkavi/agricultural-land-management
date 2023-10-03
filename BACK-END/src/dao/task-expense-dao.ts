import { Double } from "typeorm";
import { TaskExpenseDto } from "../dto/master/task-expense-dto";
import { TaskExpenseEntity } from "../entity/master/task-expense-entity";

export interface TaskExpenseDao {
  save(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity>;
  update(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity>;
  delete(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity>;
  findAll(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity[]>;
  findById(taskExpenseId: number): Promise<TaskExpenseEntity>;
  findByName(value: Double): Promise<TaskExpenseEntity>; //not sure
  findCount(taskExpenseDto: TaskExpenseDto): Promise<number> ;
}
