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
import moment from 'moment';



export class ReportServiceImpl implements ReportService {


  reportDao: ReportDao = new ReportDaoImpl();

  //employee-attendance report
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
    return this.getWeekSummary(landId);
  }

  /**
   * Daily Summary Report
   * @param landId 
   * @returns 
   */
  async getDailySummaryReport(landId?: number): Promise<any> {
    return this.GetDailySummary(landId);
  }


  /**
   * Get Month - Summary Report
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


  /**
   * Get Week - Summary Report
   * @param landId 
   */
  async getWeekSummary(landId: number): Promise<any> {

    try {

      const workAssignedEntity = await this.reportDao.getWorkAssignedEntityForWeek(landId);
      const weeklyExpenses = await this.reportDao.getPluckExpenseWeek(landId);
      const weeklyExpenses2 = await this.reportDao.getOtherExpensesWeek(landId);
      const weeklyExpenses3 = await this.reportDao.getNonCrewExpensesWeek(landId);
      const quantitySummary = await this.GetQuantitySummaryWeek(workAssignedEntity);

      const combinedSummary = Object.entries(quantitySummary).map(([key, totalQuantity]) => {
        const [year, weekNumber] = key.split(' W');
        const weekYear = `${year} W${weekNumber}`;

        const expenseForWeek = weeklyExpenses.find(expense => expense.weekNumber === parseInt(weekNumber) && expense.year === parseInt(year));
        const finalWeeklyExpenses = weeklyExpenses2.find(otherExpense => otherExpense.weekNumber === parseInt(weekNumber) && otherExpense.year === parseInt(year));
        const additionalWeeklyExpenses = weeklyExpenses3.find(taskExpense => taskExpense.weekNumber === parseInt(weekNumber) && taskExpense.year === parseInt(year));

        return {
          year: parseInt(year),
          weekNumber: parseInt(weekNumber),
          totalQuantity,
          PluckExpense: expenseForWeek ? parseFloat(expenseForWeek.totalExpense) : 0,
          OtherExpenses: finalWeeklyExpenses ? parseFloat(finalWeeklyExpenses.totalExpense) : 0,
          NonCrewExpenses: additionalWeeklyExpenses ? parseFloat(additionalWeeklyExpenses.totalExpense) : 0,
          TotalIncome: "-",
          TaskExpenses: "-",
          Profit: "-",
          CIR: "-",
        };
      });

      return combinedSummary;

    } catch (err) {
      console.error(err);
    }

  }

  /**
   * Get Weekly Quntity
   * @param workAssignedEntity 
   * @returns 
   */
  async GetQuantitySummaryWeek(workAssignedEntity: any): Promise<any> {

    const quantitySummary = workAssignedEntity.reduce((summary: any, workAssigned: any) => {
      const workDate = workAssigned.taskCard.workDate || workAssigned.startDate.toISOString().split("T")[0];
      const year = moment(workDate).isoWeekYear();
      const weekNumber = moment(workDate).isoWeek();

      const key = `${year} W${weekNumber}`;

      if (!summary[key]) {
        summary[key] = 0;
      }

      summary[key] += workAssigned.quantity || 0;

      return summary;
    }, {});

    return quantitySummary;

  }

/**
 * Get Daily Quntity
 * @param landId 
 * @returns 
 */
  async GetDailySummary(landId: number): Promise<any> {

    try {

      const workAssignedEntity = await this.reportDao.getWorkAssignedEntityForDay(landId);
      const dailyExpenses = await this.reportDao.getPluckExpenseDay(landId);
      const dailyExpenses2 = await this.reportDao.getOtherExpensesDay(landId);
      const dailyExpenses3 = await this.reportDao.getNonCrewExpensesDay(landId);
      const quantitySummary = await this.GetQuantitySummaryDay(workAssignedEntity);

      const combinedSummary = Object.entries(quantitySummary).map(([date, totalQuantity]) => {
        const expenseForDate = dailyExpenses.find(expense => expense.date === date);
        const finalDailyExpenses = dailyExpenses2.find(otherExpense => otherExpense.date === date);
        const additionalDailyExpenses = dailyExpenses3.find(taskExpense => taskExpense.date === date);

        return {
          date,
          totalQuantity,
          PluckExpense: expenseForDate ? parseFloat(expenseForDate.totalExpense) : 0,
          OtherExpenses: finalDailyExpenses ? parseFloat(finalDailyExpenses.totalExpense) : 0,
          NonCrewExpenses: additionalDailyExpenses ? parseFloat(additionalDailyExpenses.totalExpense) : 0,
          Profit: "-",
          CIR: "-",
        };
      });

      return combinedSummary;

    } catch (err) {

    }

  }

  /**
   * Get Daily Quantity
   * @param workAssignedEntity 
   * @returns 
   */
  async GetQuantitySummaryDay(workAssignedEntity: any): Promise<any> {

    const quantitySummary = workAssignedEntity.reduce((summary, workAssigned) => {
      const workDate = workAssigned.taskCard.workDate || workAssigned.startDate.toISOString().split("T")[0];
      const date = moment(workDate).format("YYYY-MM-DD");

      if (!summary[date]) {
        summary[date] = 0;
      }

      summary[date] += workAssigned.quantity || 0;

      return summary;
    }, {});

    return quantitySummary;

  }
}



