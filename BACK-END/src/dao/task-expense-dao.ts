import { TaskExpenseDto } from "../dto/master/task-expense-dto";
import { TaskExpenseEntity } from "../entity/master/task-expense-entity";

export interface TaskExpenseDao {
  save(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity>;
  update(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity>;
  delete(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity>;
  findAll(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity[]>;
  findById(taskExpenseId: number): Promise<TaskExpenseEntity>;
  //findByName(name: String): Promise<TaskExpenseEntity>;
  findCount(taskExpenseDto: TaskExpenseDto): Promise<number> ;
}
