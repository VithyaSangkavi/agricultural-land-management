import { CommonResponse } from "../../../common/dto/common-response";
import { TaskTypeDao } from "../../../dao/task-type-dao";
import { TaskTypeDaoImpl } from "../../../dao/impl/task-type-dao-impl";
import { ExpensesDto } from "../../../dto/master/expenses-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { ReportService } from "../report-service";
import { ExpensesDao } from "../../../dao/expenses-dao";
import { ExpensesDaoImpl } from "../../../dao/impl/expenses-dao-impl";
import { TaskExpenseDao } from "../../../dao/task-expense-dao";
import { TaskExpenseDaoImpl } from "../../../dao/impl/task-expense-dao-impl";

/**
 * report service layer
 *
 */
export class ReportServiceImpl implements ReportService {
  expensesDao: ExpensesDao = new ExpensesDaoImpl();
  taskExpenseDao: TaskExpenseDao = new TaskExpenseDaoImpl();

  async findExpenses(expensesDto: ExpensesDto): Promise<CommonResponse> {
      let cr = new CommonResponse();
      try {
          let expensesList = await this.expensesDao.findAExpenseIdAndType(expensesDto);

          const enhancedExpensesList = await Promise.all(
              expensesList.map(async (expense) => {
                  const taskExpenses = await this.taskExpenseDao.findByExpenseId(expense.id);
                  return {
                      ...expense,
                      taskExpenses: taskExpenses.map((taskExpense) => taskExpense.value),
                  };
              })
          );

          cr.setExtra(enhancedExpensesList);

          if (expensesDto.getStartIndex() === 0) {
              let count = await this.expensesDao.findCount(expensesDto);
              cr.setCount(count);
          }
          cr.setStatus(true);
      } catch (error) {
          cr.setStatus(false);
          cr.setExtra(error);
          ErrorHandlerSup.handleError(error);
      }
      return cr;
  }
}
