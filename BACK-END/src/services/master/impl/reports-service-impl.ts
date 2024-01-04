import { ReportDao } from '../../../dao/report-dao';
import { ReportService } from '../reports-service';
import { getConnection, getRepository } from 'typeorm';
import { WorkAssignedEntity } from '../../../entity/master/work-assigned-entity';
import { TaskTypeEntity } from '../../../entity/master/task-type-entity';
import { CropEntity } from '../../../entity/master/crop-entity';
import { IncomeEntity } from '../../../entity/master/income-entity';
import { TaskExpenseEntity } from '../../../entity/master/task-expense-entity';
import { TaskCardEntity } from "../../../entity/master/task-card-entity";
import { WorkerEntity } from "../../../entity/master/worker-entity";
import { TaskAssignedEntity } from '../../../entity/master/task-assigned-entity';
import { ExpensesEntity } from "../../../entity/master/expense-entity";
import { LandEntity } from "../../../entity/master/land-entity";
import { Units } from "../../../enum/units";
import { Status } from '../../../enum/Status';
import { TaskStatus } from '../../../enum/taskStatus';
import { Schedule } from '../../../enum/schedule';
import { ReportDaoImpl } from '../../../dao/impl/report-dao-impl';



export class ReportServiceImpl implements ReportService {


  reportDao: ReportDao = new ReportDaoImpl();
    
  /**
   * Get employee attendance report
   * @param startDate 
   * @param endDate 
   * @param lotId 
   * @param landId 
   * @returns any
   */
  async generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number, landId: number): Promise<any[]> {
    return this.reportDao.generateEmployeeAttendanceReport(startDate, endDate, lotId, landId);
  }
  
  //monthly-crop report
  async generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date, landId: number): Promise<any[]> {
    return this.reportDao.generateMonthlyCropReport(lotId, startDate, endDate, landId);
  }

  //other-cost-yield report
  async generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any[]> {
    return this.reportDao.generateOtherCostYieldReport(startDate, endDate, landId, lotId);
  }


  //employee prefomnce report
  async getEmployeePerfomanceReport(fromDate?: string, toDate?: string, landId?: number): Promise<any> {
    return this.reportDao.getEmployeePerfomanceReport(fromDate, toDate, landId);
  }
  //Cost Breakdown Line Report
  async getCostBreakdownLineReport(fromDate?: string, landId?: number): Promise<any> {
    return this.reportDao.getCostBreakdownLineReport(fromDate, landId);

  }

  //Cost Breakdown Pi eReport
  async getCostBreakdownPieReport(): Promise<any> {
    return this.reportDao.getCostBreakdownPieReport()
  }


  //Summary Report
  async getSummaryReport(landId?: number, cateNum?: number): Promise<any> {
    return this.getSummary(landId);
  }

  async getWeeklySummaryReport(landId?: number): Promise<any> {
    return this.reportDao.getWeeklySummaryReport(landId);
  }

  async getDailySummaryReport(landId?: number): Promise<any> {
    return this.reportDao.getDailySummaryReport(landId);
  }

  //Summary
  async getSummary(landId: number): Promise<any> {

    try {
      const summeryResult = await this.reportDao.getSummaryReport(landId);

      const combinedSummary = Object.entries(summeryResult.quantitySummary).map(([key, totalQuantity]) => {
        const [month, year] = key.split(' ');
  
        const expenseForMonth = summeryResult.monthlyExpenses.find(expense => expense.monthYear === `${month} ${year}`);
        const finalMonthlyExpenses = summeryResult.monthlyExpenses2.find(otherExpense => otherExpense.monthYear === `${month} ${year}`);
        const additionalMonthlyExpenses = summeryResult.monthlyExpenses3.find(taskExpense => taskExpense.monthYear === `${month} ${year}`);
        const incomeForMonth = summeryResult.groupedIncomeByMonthAndYear.find(income => income.monthYear === `${month} ${year}`);
        const taskExpenseForMonth = summeryResult.monthlyExpenses4.find(taskExpense => taskExpense.monthYear === `${month} ${year}`);
  
        const CIR = findCIR(taskExpenseForMonth, incomeForMonth);
        const profit = findProfit(incomeForMonth, taskExpenseForMonth);
  
        return {
          month,
          year,
          totalQuantity,
          PluckExpense: expenseForMonth ? parseFloat(expenseForMonth.totalExpense) : 0,
          OtherExpenses: finalMonthlyExpenses ? parseFloat(finalMonthlyExpenses.totalExpense) : 0,
          NonCrewExpenses: additionalMonthlyExpenses ? parseFloat(additionalMonthlyExpenses.totalExpense) : 0,
          TotalIncome: incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0,
          TaskExpenses: taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0,
  
          Profit: profit,
          CIR: CIR,
        };
      });
      return combinedSummary;
    } catch (e) {
      console.log(e);
      
    }
  }
}

export function findCIR(taskExpenseForMonth: any, incomeForMonth: any): number {

  console.log(taskExpenseForMonth, incomeForMonth);
  
  const CIR = ((taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0) /
        (incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0)).toFixed(2);

  return parseFloat(CIR);
}

export function findProfit(incomeForMonth: any, taskExpenseForMonth: any): number {
  const profit = (incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0) - (taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0);

  return parseFloat(profit.toString());
}
