import { getRepository } from 'typeorm';
import { WorkAssignedEntity } from '../../../entity/master/work-assigned-entity';
import { ReportService } from '../reports-service';
import { TaskTypeEntity } from '../../../entity/master/task-type-entity';
import { CropEntity } from '../../../entity/master/crop-entity';
import { IncomeEntity } from '../../../entity/master/income-entity';
import { TaskExpenseEntity } from '../../../entity/master/task-expense-entity';

export class ReportServiceImpl implements ReportService {
  //Employee attendance report
  async generateEmployeeAttendanceReport(startDate?: Date, endDate?: Date, lotId?: number): Promise<any> {
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


  //Monthly crop report
  async generateMonthlyCropReport(): Promise<any> {
    const workAssignedRepository = getRepository(WorkAssignedEntity);

    try {
      const currentYear = new Date().getFullYear();
      const pastYear = currentYear - 1;

      const quantitiesForCurrentYear = await workAssignedRepository.createQueryBuilder('work_assigned')
        .leftJoin(TaskTypeEntity, 'task', 'work_assigned.taskId = task.id')
        .leftJoin(CropEntity, 'crop', 'task.cropId = crop.id')
        .select('SUM(work_assigned.quantity)', 'totalQuantity')
        .addSelect('EXTRACT(MONTH FROM work_assigned.updatedDate)', 'month')
        .where('EXTRACT(YEAR FROM work_assigned.updatedDate) = :currentYear', { currentYear })
        .groupBy('EXTRACT(MONTH FROM work_assigned.updatedDate)')
        .getRawMany();

      const quantitiesForPastYear = await workAssignedRepository.createQueryBuilder('work_assigned')
        .leftJoin(TaskTypeEntity, 'task', 'work_assigned.taskId = task.id')
        .leftJoin(CropEntity, 'crop', 'task.cropId = crop.id')
        .select('SUM(work_assigned.quantity)', 'totalQuantity')
        .addSelect('EXTRACT(MONTH FROM work_assigned.updatedDate)', 'month')
        .where('EXTRACT(YEAR FROM work_assigned.updatedDate) = :pastYear', { pastYear })
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

  //Cost-Yield Report
  async generateOtherCostYieldReport(): Promise<any> {
    const taskExpenseRepository = getRepository(TaskExpenseEntity);
    const incomeRepository = getRepository(IncomeEntity);

    try {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      // Get task expenses grouped by month
      const taskExpenses = await taskExpenseRepository.createQueryBuilder('task_expense')
        .select('SUM(task_expense.value)', 'cost')
        .addSelect('EXTRACT(MONTH FROM task_expense.createdDate)', 'month')
        .groupBy('EXTRACT(MONTH FROM task_expense.createdDate)')
        .getRawMany();

      // Get incomes grouped by month
      const incomes = await incomeRepository.createQueryBuilder('income')
        .select('SUM(income.price)', 'yield')
        .addSelect('income.month')
        .groupBy('income.month')
        .getRawMany();

      // Merge the cost and yield data for each month
      const monthlyData = {};
      const incomeMonths = incomes.map(item => item.income_month);

      monthNames.forEach((monthName, index) => {
        const costEntry = taskExpenses.find(item => Number(item.month) === index + 1);
        const yieldEntry = incomes.find(item => item.income_month === monthName);

        monthlyData[monthName] = {
          Cost: costEntry ? costEntry.cost || 0 : 0,
          Yield: yieldEntry ? yieldEntry.yield || 0 : 0
        };
      });

      return monthlyData;
    } catch (error) {
      throw new Error(`Error generating Other Cost / Yield report: ${error}`);
    }
  }

}