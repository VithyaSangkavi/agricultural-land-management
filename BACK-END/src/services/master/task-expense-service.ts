import { CommonResponse } from "../../common/dto/common-response";
import { TaskExpenseDto } from "../../dto/master/task-expense-dto";

export interface TaskExpenseService {
  save(taskExpenseDto: TaskExpenseDto): Promise<CommonResponse>;
  update(taskExpenseDto: TaskExpenseDto): Promise<CommonResponse>;
  delete(taskExpenseDto: TaskExpenseDto): Promise<CommonResponse>;
  find(taskExpenseDto: TaskExpenseDto): Promise<CommonResponse>;
  findById(taskExpenseId: number): Promise<CommonResponse>;
}
