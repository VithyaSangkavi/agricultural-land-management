import { getRepository, Repository } from 'typeorm';
import { WorkAssignedEntity } from '../../entity/master/work-assigned-entity';
import { TaskTypeEntity } from '../../entity/master/task-type-entity';
import { CropEntity } from '../../entity/master/crop-entity';
import { TaskExpenseEntity } from '../../entity/master/task-expense-entity';
import { IncomeEntity } from '../../entity/master/income-entity';
import { ReportDao } from "../report-dao";

export class ReportDaoImpl implements ReportDao {

  //employee-attendance report
  async generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number): Promise<any> {
    const workAssignedRepository = getRepository(WorkAssignedEntity);
    let query = workAssignedRepository
      .createQueryBuilder('work_assigned')
      .select('DATE(work_assigned.updatedDate)', 'date')
      .addSelect('COUNT(DISTINCT work_assigned.workerId)', 'numberOfWorkers')
      .groupBy('DATE(work_assigned.updatedDate)')
      .orderBy('date', 'ASC');

    //Filter by a date range
    if (startDate && endDate) {
      query = query.andWhere('work_assigned.updatedDate BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    // Filter by lotId 
    if (lotId) {
      query = query.andWhere('work_assigned.lotId = :lotId', { lotId });
    }

    try {
      const employeeAttendance = await query.getRawMany();
      return employeeAttendance;
    } catch (error) {
      throw new Error(`Error fetching employee attendance: ${error}`);
    }
  }

  //Monthly-crop report
  async generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date): Promise<any> {
    const workAssignedRepository = getRepository(WorkAssignedEntity);

    try {
      const currentYear = new Date().getFullYear();
      const pastYear = currentYear - 1;

      const queryForCurrentYear = workAssignedRepository.createQueryBuilder('work_assigned')
        .leftJoin(TaskTypeEntity, 'task', 'work_assigned.taskId = task.id')
        .leftJoin(CropEntity, 'crop', 'task.cropId = crop.id')
        .select('SUM(work_assigned.quantity)', 'totalQuantity')
        .addSelect('EXTRACT(MONTH FROM work_assigned.updatedDate)', 'month')
        .where('EXTRACT(YEAR FROM work_assigned.updatedDate) = :currentYear', { currentYear });

      const queryForPastYear = workAssignedRepository.createQueryBuilder('work_assigned')
        .leftJoin(TaskTypeEntity, 'task', 'work_assigned.taskId = task.id')
        .leftJoin(CropEntity, 'crop', 'task.cropId = crop.id')
        .select('SUM(work_assigned.quantity)', 'totalQuantity')
        .addSelect('EXTRACT(MONTH FROM work_assigned.updatedDate)', 'month')
        .where('EXTRACT(YEAR FROM work_assigned.updatedDate) = :pastYear', { pastYear });

      //filter by lot id
      if (lotId !== undefined) {
        queryForCurrentYear.andWhere('work_assigned.lotId = :lotId', { lotId });
        queryForPastYear.andWhere('work_assigned.lotId = :lotId', { lotId });
      }

      // Filter by date range
      if (startDate && endDate) {
        // Common condition for both queries
        const dateCondition = startDate && endDate ? 'work_assigned.updatedDate BETWEEN :startDate AND :endDate' : '';

        // Apply the common condition to the queries
        if (dateCondition) {
          queryForCurrentYear.andWhere(dateCondition, { startDate, endDate });
          queryForPastYear.andWhere(dateCondition, { startDate, endDate });
        }
      }

      const quantitiesForCurrentYear = await queryForCurrentYear
        .groupBy('EXTRACT(MONTH FROM work_assigned.updatedDate)')
        .getRawMany();

      const quantitiesForPastYear = await queryForPastYear
        .groupBy('EXTRACT(MONTH FROM work_assigned.updatedDate)')
        .getRawMany();

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
    } catch (error) {
      throw new Error(`Error generating monthly crop report: ${error}`);
    }
  }

  //other-cost-yield report
  async generateOtherCostYieldReport(startDate: Date, endDate: Date): Promise<any> {
    const taskExpenseRepository = getRepository(TaskExpenseEntity);
    const incomeRepository = getRepository(IncomeEntity);

    try {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const taskExpensesQuery = taskExpenseRepository.createQueryBuilder('task_expense')
        .select('SUM(task_expense.value)', 'cost')
        .addSelect('EXTRACT(MONTH FROM task_expense.createdDate)', 'month')
      //.groupBy('EXTRACT(MONTH FROM task_expense.createdDate)');

      const incomesQuery = incomeRepository.createQueryBuilder('income')
        .select('SUM(income.price)', 'yield')
        .addSelect('income.month')
      //.groupBy('income.month');

      // Filter by date range
      if (startDate && endDate) {
        taskExpensesQuery.andWhere('task_expense.createdDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
        incomesQuery.andWhere('income.createdDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }

      const taskExpenses = await taskExpensesQuery
        .groupBy('EXTRACT(MONTH FROM task_expense.createdDate)')
        .getRawMany();

      const incomes = await incomesQuery
        .groupBy('income.month')
        .getRawMany();

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
    } catch (error) {
      throw new Error(`Error generating Other Cost / Yield report: ${error}`);
    }
  }
}