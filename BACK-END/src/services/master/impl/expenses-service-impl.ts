import { CommonResponse } from "../../../common/dto/common-response";
import { ExpensesDao } from "../../../dao/expenses-dao";
import { ExpensesDaoImpl } from "../../../dao/impl/expenses-dao-impl";
import { ExpensesDto } from "../../../dto/master/expenses-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { ExpensesService } from "../expenses-service";

/**expenses
 * expenses service layer
 *
 */
export class ExpensesServiceImpl implements ExpensesService {
  expensesDao: ExpensesDao = new ExpensesDaoImpl();

  /**
   * save new expenses
   * @param expensesDto
   * @returns
   */
  async save(expensesDto: ExpensesDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (expensesDto.getExpenseType) {
        // check name already have
        let nameExpensesMode = await this.expensesDao.findByName(expensesDto.getExpenseType());
        if (nameExpensesMode) {
          return CommonResSupport.getValidationException("Expenses Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Expenses Name Cannot Be null !");
      }

      // save new expenses
      let newExpenses = await this.expensesDao.save(expensesDto);
      cr.setStatus(true);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update expenses
   * @param expensesDto
   * @returns
   */
  async update(expensesDto: ExpensesDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (expensesDto.getExpenseType()) {
        // check name already have
        let nameExpensesMode = await this.expensesDao.findByName(expensesDto.getExpenseType());
        if (nameExpensesMode && nameExpensesMode.id != expensesDto.getExpensesId()) {
          return CommonResSupport.getValidationException("Expenses Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Expenses Name Cannot Be null !");
      }

      // update expenses
      let updateExpenses = await this.expensesDao.update(expensesDto);
      if (updateExpenses) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Expenses Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete expenses
   * not delete from db.just update its status as offline
   * @param expensesDto
   * @returns
   */
  async delete(expensesDto: ExpensesDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete expenses
      let deleteExpenses = await this.expensesDao.delete(expensesDto);
      if (deleteExpenses) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Expenses Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all expensess
   * @returns
   */
  async find(expensesDto: ExpensesDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find expenses
      let expensess = await this.expensesDao.findAll(expensesDto);
      let expensesDtoList = new Array();
      for (const expensesModel of expensess) {
        let expensesDto = new ExpensesDto();
        expensesDto.filViaDbObject(expensesModel);
        expensesDtoList.push(expensesDto);
      }
      if (expensesDto.getStartIndex() == 0) {
        let count = await this.expensesDao.findCount(expensesDto);
        cr.setCount(count);
      }
      cr.setStatus(true);
      cr.setExtra(expensesDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find expenses by id
   * @param expensesId
   * @returns
   */
  async findById(expensesId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find expenses
      let expenses = await this.expensesDao.findById(expensesId);

      let expensesDto = new ExpensesDto();
      expensesDto.filViaDbObject(expenses);

      cr.setStatus(true);
      cr.setExtra(expensesDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
}
