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
  
  /**
   * Get monthly-crop report
   * @param lotId 
   * @param startDate 
   * @param endDate 
   * @param landId 
   * @returns any
   */
  async generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date, landId: number): Promise<any[]> {
    return this.reportDao.generateMonthlyCropReport(lotId, startDate, endDate, landId);
  }

  /**
   * Get other cost / yield
   * @param startDate 
   * @param endDate 
   * @param landId 
   * @param lotId 
   * @returns any
   */
  async generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any[]> {
    return this.reportDao.generateOtherCostYieldReport(startDate, endDate, landId, lotId);
  }


  /**
   * Employee Prefomnce Report
   * @param fromDate 
   * @param toDate 
   * @param landId 
   * @returns 
   */
  async getEmployeePerfomanceReport(fromDate?: string, toDate?: string, landId?: number): Promise<any> {
    return this.reportDao.getEmployeePerfomanceReport(fromDate, toDate, landId);
  }


  /**
   * Cost Breakdown Line chart Report
   * @param fromDate 
   * @param landId 
   * @returns 
   */
  async getCostBreakdownLineReport(fromDate?: string, landId?: number): Promise<any> {
    return this.reportDao.getCostBreakdownLineReport(fromDate, landId);

  }


  /**
   * Cost Breakdown Pie chart Report
   * @returns 
   */
  async getCostBreakdownPieReport(): Promise<any> {
    return this.reportDao.getCostBreakdownPieReport()
  }


  /**
   * Monthly Summary Report
   * @param landId 
   * @param cateNum 
   * @returns 
   */
  async getSummaryReport(landId?: number, cateNum?: number): Promise<any> {
    return this.getSummary(landId);
  }

  /**
   * Weekly Summary Report
   * @param landId 
   * @returns 
   */
  async getWeeklySummaryReport(landId?: number): Promise<any> {
    return this.reportDao.getWeeklySummaryReport(landId);
  }

  /**
   * Daily Summary Report
   * @param landId 
   * @returns 
   */
  async getDailySummaryReport(landId?: number): Promise<any> {
    return this.reportDao.getDailySummaryReport(landId);
  }


  /**
   * Get Summary Report
   * @param landId 
   * @returns any
   */
  async getSummary(landId: number): Promise<any> {

    try {
      const workAssignedEntity = await this.reportDao.getWorkAssignedEntity(landId);
      const monthlyExpenses = await this.reportDao.getPluckExpense(landId);
      const monthlyExpenses2 = await this.reportDao.getOtherExpenses(landId);
      const monthlyExpenses3 = await this.reportDao.getNonCrewExpenses(landId);
      const groupedIncomeByMonthAndYear = await this.reportDao.getTotalIncome(landId);
      const monthlyExpenses4 = await this.reportDao.getTaskExpenses(landId);

      const quantitySummary = await this.GetQuantitySummary(workAssignedEntity);

      const combinedSummary = await Promise.all(Object.entries(quantitySummary).map(async ([key, totalQuantity]) => {
        const [month, year] = key.split(' ');

        const expenseForMonth = monthlyExpenses.find(expense => expense.monthYear === `${month} ${year}`);
        const finalMonthlyExpenses = monthlyExpenses2.find(otherExpense => otherExpense.monthYear === `${month} ${year}`);
        const additionalMonthlyExpenses = monthlyExpenses3.find(taskExpense => taskExpense.monthYear === `${month} ${year}`);
        const incomeForMonth = groupedIncomeByMonthAndYear.find(income => income.monthYear === `${month} ${year}`);
        const taskExpenseForMonth = monthlyExpenses4.find(taskExpense => taskExpense.monthYear === `${month} ${year}`);

        const CIR = await this.findCIR(taskExpenseForMonth, incomeForMonth);
        const Profit = await this.findProfit(incomeForMonth, taskExpenseForMonth);

        return {
          month,
          year,
          totalQuantity,
          PluckExpense: expenseForMonth ? parseFloat(expenseForMonth.totalExpense) : 0,
          OtherExpenses: finalMonthlyExpenses ? parseFloat(finalMonthlyExpenses.totalExpense) : 0,
          NonCrewExpenses: additionalMonthlyExpenses ? parseFloat(additionalMonthlyExpenses.totalExpense) : 0,
          TotalIncome: incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0,
          TaskExpenses: taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0,

          Profit: Profit,
          CIR: CIR,
        };
      }));

      return combinedSummary;

    } catch (e) {
      console.log(e);

    }
  }

  async findProfit(incomeForMonth: any, taskExpenseForMonth: any): Promise<number> {

    const Profit = (incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0) -
      (taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0);

    return Profit;
  }

  async findCIR(taskExpenseForMonth: any, incomeForMonth: any): Promise<number> {

    const CIR = ((taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0) /
      (incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0)).toFixed(2);

    return parseFloat(CIR);
  }

  async GetQuantitySummary(workAssignedEntity: any): Promise<any> {

    const quantitySummary = workAssignedEntity.reduce((summary: any, workAssigned: any) => {
      const workDate = workAssigned.taskCard.workDate || workAssigned.startDate.toISOString().split("T")[0];
      const year = new Date(workDate).getFullYear();
      const month = new Date(workDate).toLocaleString('en-US', { month: 'long' });
      const key = `${month} ${year}`;

      if (!summary[key]) {
        summary[key] = 0;
      }

      summary[key] += workAssigned.quantity || 0;

      return summary;
    }, {})

    return quantitySummary;

  }

  // async findProfit(incomeForMonth: any, taskExpenseForMonth: any): Promise<number> {

  //   const profit = (incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0) - (taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0);

  //   return parseFloat(profit.toString());
  // }
}