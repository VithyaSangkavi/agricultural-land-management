import { ReportDao } from '../../../dao/report-dao';
import { ReportService } from '../reports-service';
import { ReportDaoImpl } from '../../../dao/impl/report-dao-impl';
import moment from 'moment';

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
    try {
      return this.reportDao.generateEmployeeAttendanceReport(startDate, endDate, lotId, landId);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get monthly-crop report
   * @param lotId 
   * @param startDate 
   * @param endDate 
   * @param landId 
   * @returns any
   */
  async generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date, landId: number): Promise<any> {
    try {

      const currentYear = new Date().getFullYear();
      const pastYear = currentYear - 1;

      const quantitiesForCurrentYear = await this.reportDao.getCurrentYearQuantityForMonthlyCrop(currentYear, lotId, startDate, endDate, landId);
      const quantitiesForPastYear = await this.reportDao.getPastYearQuantityForMonthlyCrop(pastYear, lotId, startDate, endDate, landId);

      const getMonthName = (monthNumber: number): string => {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        if (monthNumber >= 1 && monthNumber <= 12) {
          return monthNames[monthNumber - 1];
        }
        return 'Invalid Month';
      };

      const formattedQuantitiesForCurrentYear = {};
      const formattedQuantitiesForPastYear = {};

      quantitiesForCurrentYear.forEach(item => {
        const monthName = getMonthName(item.month);
        if (!formattedQuantitiesForCurrentYear[monthName]) {
          formattedQuantitiesForCurrentYear[monthName] = [];
        }
        formattedQuantitiesForCurrentYear[monthName].push({
          PastYearTotalQuantity: '-',
          CurrentYearTotalQuantity: item.totalQuantity
        });
      });

      quantitiesForPastYear.forEach(item => {
        const monthName = getMonthName(item.month);
        if (!formattedQuantitiesForPastYear[monthName]) {
          formattedQuantitiesForPastYear[monthName] = [];
        }
        formattedQuantitiesForPastYear[monthName].push({
          PastYearTotalQuantity: item.totalQuantity,
          CurrentYearTotalQuantity: '-'
        });
      });

      // Merging quantities for each month
      const monthlyQuantities = {};

      const months = new Set([
        ...Object.keys(formattedQuantitiesForCurrentYear),
        ...Object.keys(formattedQuantitiesForPastYear)
      ]);

      months.forEach(month => {
        if (!monthlyQuantities[month]) {
          monthlyQuantities[month] = [];
        }
        const pastYearData = formattedQuantitiesForPastYear[month] || [{ PastYearTotalQuantity: 0 }];
        const currentYearData = formattedQuantitiesForCurrentYear[month] || [{ CurrentYearTotalQuantity: 0 }];

        pastYearData.forEach(pastYearItem => {
          const currentYearItem = currentYearData.find(currentYearItem => currentYearItem.CurrentYearTotalQuantity !== '-');
          monthlyQuantities[month].push({
            PastYearTotalQuantity: pastYearItem.PastYearTotalQuantity || 0,
            CurrentYearTotalQuantity: currentYearItem ? currentYearItem.CurrentYearTotalQuantity : '-'
          });
        });
      });

      return monthlyQuantities;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get other cost / yield
   * @param startDate 
   * @param endDate 
   * @param landId 
   * @param lotId 
   * @returns any
   */
  async generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any> {
    try {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const taskExpenses = await this.reportDao.getTaskExpenseForCostYield(startDate, endDate, landId, lotId);
      const incomes = await this.reportDao.getIncomeForCostYield(startDate, endDate, landId, lotId);

      const monthlyData = {};
      const incomeMonths = incomes.map(item => item.income_month);

      monthNames.forEach((monthName, index) => {
        const costEntry = taskExpenses.find(item => Number(item.month) === index + 1);
        const yieldEntry = incomes.find(item => item.income_month === monthName);

        if (costEntry || yieldEntry) {
          monthlyData[monthName] = {
            Cost: costEntry ? costEntry.cost || 0 : 0,
            Yield: yieldEntry ? yieldEntry.yield || 0 : 0
          };
        }
      });

      return monthlyData;

    } catch (err) {
      console.error(err);
    }
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
  async getSummaryReport(landId?: number, cateNum?: number, fromDate?: string): Promise<any> {
    return this.getSummary(landId, fromDate);
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
  async getSummary(landId: number, fromDate: string): Promise<any> {

    try {
      const workAssignedEntity = await this.reportDao.getWorkAssignedEntity(landId, fromDate);
      const monthlyExpenses = await this.reportDao.getPluckExpense(landId, fromDate);
      const monthlyExpenses2 = await this.reportDao.getOtherExpenses(landId, fromDate);
      const monthlyExpenses3 = await this.reportDao.getNonCrewExpenses(landId, fromDate);
      const monthlyExpenses4 = await this.reportDao.getTaskExpenses(landId, fromDate);
      const quantitySummary = await this.GetQuantitySummary(workAssignedEntity, fromDate);
      const groupedIncomeByMonthAndYear = await this.reportDao.getTotalIncome(landId, fromDate);

      const allMonths = Array.from(
        new Set([
          ...Object.keys(quantitySummary),
          ...monthlyExpenses.map(expense => expense.monthYear),
          ...monthlyExpenses2.map(otherExpense => otherExpense.monthYear),
          ...monthlyExpenses3.map(taskExpense => taskExpense.monthYear),
          ...monthlyExpenses4.map(taskExpense => taskExpense.monthYear),
          ...groupedIncomeByMonthAndYear.map(income => income.monthYear)
        ])
      );

      const combinedSummary = await Promise.all(allMonths.map(async (monthYear) => {
        const [month, year] = monthYear.split(' ');

        const expenseForMonth = monthlyExpenses.find(expense => expense.monthYear === monthYear);
        const finalMonthlyExpenses = monthlyExpenses2.find(otherExpense => otherExpense.monthYear === monthYear);
        const additionalMonthlyExpenses = monthlyExpenses3.find(taskExpense => taskExpense.monthYear === monthYear);
        const incomeForMonth = groupedIncomeByMonthAndYear.find(income => income.monthYear === monthYear);
        const taskExpenseForMonth = monthlyExpenses4.find(taskExpense => taskExpense.monthYear === monthYear);

        const CIR = await this.findCIR(taskExpenseForMonth, incomeForMonth);
        const Profit = await this.findProfit(incomeForMonth, taskExpenseForMonth);

        return {
          month,
          year,
          totalQuantity: quantitySummary[monthYear] || 0,
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


  async GetQuantitySummary(workAssignedEntity: any, fromDate: string): Promise<any> {

    const filteredWorkAssigned = fromDate
      ? workAssignedEntity.filter((workAssigned: any) => {
        const workDate = workAssigned.taskCard.workDate || workAssigned.startDate.toISOString().split("T")[0];
        const yearMonthFromDate = fromDate.substring(0, 7); 
        const yearMonthWorkDate = workDate.substring(0, 7); 
        return yearMonthWorkDate === yearMonthFromDate;
      })
      : workAssignedEntity;

    const quantitySummary = filteredWorkAssigned.reduce((summary: any, workAssigned: any) => {
      const workDate = workAssigned.taskCard.workDate || workAssigned.startDate.toISOString().split("T")[0];
      const year = new Date(workDate).getFullYear();
      const month = new Date(workDate).toLocaleString('en-US', { month: 'long' });
      const key = `${month} ${year}`;

      if (!summary[key]) {
        summary[key] = 0;
      }

      summary[key] += workAssigned.quantity || 0;

      console.log("Summary :", summary);

      return summary;
    }, {});

    console.log("Qty Summary :", quantitySummary);

    return quantitySummary;
  }




  async findCIR(taskExpenseForMonth: any, incomeForMonth: any): Promise<number> {

    const CIR = ((taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0) /
      (incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0)).toFixed(2);

    return parseFloat(CIR);
  }

  async findProfit(incomeForMonth: any, taskExpenseForMonth: any): Promise<number> {

    const profit = (incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0) - (taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0);

    return parseFloat(profit.toString());
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

      const allWeeks = Array.from(
        new Set([
          ...Object.keys(quantitySummary),
          ...weeklyExpenses.map(expense => `${expense.year} W${expense.weekNumber}`),
          ...weeklyExpenses2.map(otherExpense => `${otherExpense.year} W${otherExpense.weekNumber}`),
          ...weeklyExpenses3.map(taskExpense => `${taskExpense.year} W${taskExpense.weekNumber}`),
        ])
      );

      const combinedSummary = allWeeks.map((weekKey) => {
        const [year, weekNumber] = weekKey.split(' W');

        const expenseForWeek = weeklyExpenses.find(expense => expense.weekNumber === parseInt(weekNumber) && expense.year === parseInt(year));
        const finalWeeklyExpenses = weeklyExpenses2.find(otherExpense => otherExpense.weekNumber === parseInt(weekNumber) && otherExpense.year === parseInt(year));
        const additionalWeeklyExpenses = weeklyExpenses3.find(taskExpense => taskExpense.weekNumber === parseInt(weekNumber) && taskExpense.year === parseInt(year));

        return {
          year: parseInt(year),
          weekNumber: parseInt(weekNumber),
          totalQuantity: quantitySummary[weekKey] || 0,
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

      const allDates = Array.from(
        new Set([
          ...Object.keys(quantitySummary),
          ...dailyExpenses.map(expense => expense.formattedDate),
          ...dailyExpenses2.map(otherExpense => otherExpense.formattedDate),
          ...dailyExpenses3.map(taskExpense => taskExpense.formattedDate),
        ])
      );

      const combinedSummary = allDates.map((date) => {
        const expenseForDate = dailyExpenses.find(expense => expense.formattedDate === date);
        const finalDailyExpenses = dailyExpenses2.find(otherExpense => otherExpense.formattedDate === date);
        const additionalDailyExpenses = dailyExpenses3.find(taskExpense => taskExpense.formattedDate === date);

        return {
          date,
          totalQuantity: quantitySummary[date] || 0,
          PluckExpense: expenseForDate ? parseFloat(expenseForDate.totalExpense) : 0,
          OtherExpenses: finalDailyExpenses ? parseFloat(finalDailyExpenses.totalExpense) : 0,
          NonCrewExpenses: additionalDailyExpenses ? parseFloat(additionalDailyExpenses.totalExpense) : 0,
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
   * Get Daily Quantity
   * @param workAssignedEntity 
   * @returns 
   */
  async GetQuantitySummaryDay(workAssignedEntity: any): Promise<any> {

    const quantitySummary = workAssignedEntity.reduce((summary: any, workAssigned: any) => {
      const workDate = workAssigned.taskCard.workDate || workAssigned.createdDate.toISOString().split("T")[0];
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
