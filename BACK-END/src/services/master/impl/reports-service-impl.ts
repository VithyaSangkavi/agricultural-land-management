import { getConnection, getRepository } from 'typeorm';
import { WorkAssignedEntity } from '../../../entity/master/work-assigned-entity';
import { ReportService } from '../reports-service';
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




export class ReportServiceImpl implements ReportService {
  //Employee attendance report
  async generateEmployeeAttendanceReport(): Promise<any> {
    const workAssignedRepository = getRepository(WorkAssignedEntity);

    try {
      const employeeAttendance = await workAssignedRepository
        .createQueryBuilder('work_assigned')
        .select('DATE(work_assigned.updatedDate)', 'date')
        .addSelect('COUNT(DISTINCT work_assigned.workerId)', 'numberOfWorkers')
        .groupBy('DATE(work_assigned.updatedDate)')
        .orderBy('date', 'ASC')
        .getRawMany();

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

  async getEmployeePerfomanceReport(): Promise<any> {

    const connection = getConnection();
    const queryBuilder = connection.createQueryBuilder();

    const result = await queryBuilder
      .select([
        "worker.name AS workerName",
        "taskType.taskName AS taskName",
        "CASE WHEN taskAssigned.schedule = 'Scheduled' THEN taskCard.workDate ELSE DATE(workAssigned.updatedDate) END AS workDate",
        "workAssigned.quantity AS quantity",
      ])
      .from(WorkAssignedEntity, "workAssigned")
      .leftJoin(TaskCardEntity, "taskCard", "workAssigned.taskCardId = taskCard.id")
      .leftJoin(TaskAssignedEntity, "taskAssigned", "workAssigned.taskAssignedId = taskAssigned.id")
      .innerJoin(TaskTypeEntity, "taskType", "workAssigned.taskId = taskType.id")
      .innerJoin(WorkerEntity, "worker", "workAssigned.workerId = worker.id")
      .where("taskType.taskName = :taskName", { taskName: "Pluck" })
      .orderBy("workDate", "ASC")
      .getRawMany();

    return result;

  }

  async getCostBreakdownLineReport(): Promise<any> {
    const connection = getConnection();
    const queryBuilder = connection.createQueryBuilder();

    const result = await queryBuilder
      .select([
        'DATE_FORMAT(te.createdDate, "%M") AS month',
        'SUM(te.value) AS totalCost',
        'e.expenseType AS expenseType',
      ])
      .from(TaskExpenseEntity, 'te')
      .leftJoin('te.expense', 'e')
      .groupBy('DATE_FORMAT(te.createdDate, "%M"), e.expenseType')
      .orderBy("month", "DESC")
      .getRawMany();

    return result;
  }

  async getCostBreakdownPieReport(): Promise<any> {
    const connection = getConnection();
    const queryBuilder = connection.createQueryBuilder();

    const result = await queryBuilder
      .select("expense.expenseType", "expenseType")
      .addSelect("SUM(taskExpense.value)", "totalCost")
      .from(ExpensesEntity, "expense")
      .leftJoin("expense.taskExpense", "taskExpense")
      .groupBy("expense.expenseType")
      .getRawMany();

    return result;
  }

  async getSummaryReport(landId: number): Promise<any> {
    const workAssignedRepository = getRepository(WorkAssignedEntity);

    const workAssignedEntities = await workAssignedRepository
      .createQueryBuilder("workAssigned")
      .leftJoinAndSelect("workAssigned.taskCard", "taskCard")
      .leftJoinAndSelect("taskCard.taskAssigned", "taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("land.id = :landId", { landId })
      .getMany();

    // Step 01
    const pluckTaskIds = await (await getRepository(TaskTypeEntity)
      .createQueryBuilder("task")
      .where("task.taskName = :taskName", { taskName: "Pluck" })
      .select("task.id")
      .getMany())
      .map(task => task.id);

    // Step 02
    const taskAssignedIds = await (await getRepository(TaskAssignedEntity)
      .createQueryBuilder("taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("land.id = :landId", { landId })
      .andWhere("taskAssigned.taskId IN (:...pluckTaskIds)", { pluckTaskIds })
      .select("taskAssigned.id")
      .getMany())
      .map(taskAssigned => taskAssigned.id);

    // Step 03
    const monthlyExpenses = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .select("SUM(taskExpense.value)", "totalExpense")
      .addSelect("DATE_FORMAT(taskExpense.createdDate, '%M %Y')", "monthYear")
      .where("taskExpense.taskAssignedId IN (:...taskAssignedIds)", { taskAssignedIds })
      .groupBy("monthYear")
      .getRawMany();


    // Filter Non Pluck Task Id from Task Table
    const pluckTaskIds2 = await getRepository(TaskTypeEntity)
      .createQueryBuilder("task")
      .where("task.taskName = :pluckTaskName", { pluckTaskName: "Pluck" })
      .getMany();

    const pluckTaskIdsArray = pluckTaskIds2.map((pluckTask) => pluckTask.id);

    // Filter TaskAssignedIds Related to Excluded Pluck Tasks from TaskAssigned Table
    const nonPluckTaskAssignedIds = await getRepository(TaskAssignedEntity)
      .createQueryBuilder("taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("land.id = :landId", { landId })
      .andWhere("taskAssigned.taskId NOT IN (:pluckTaskIds2)", { pluckTaskIds2: pluckTaskIdsArray })
      .getMany();

    const nonPluckTaskAssignedIdsArray = nonPluckTaskAssignedIds.map((taskAssigned) => taskAssigned.id);

    // Calculate Sum of Values for Each Month Based on Filtered TaskAssignedIds using TaskExpenses Table
    const monthlyExpenses2 = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .select("SUM(taskExpense.value)", "totalExpense")
      .addSelect("DATE_FORMAT(taskExpense.createdDate, '%M %Y')", "monthYear")
      .where("taskExpense.taskAssignedId IN (:taskAssignedIds)", { taskAssignedIds: nonPluckTaskAssignedIdsArray })
      .groupBy("monthYear")
      .getRawMany();



    // Filter Salary Expense Id from Expense Table
    const salaryExpense = await getRepository(ExpensesEntity)
      .createQueryBuilder("expense")
      .where("expense.expenseType = :salaryExpenseType", { salaryExpenseType: "Salary" })
      .getOne();

    const salaryExpenseId = salaryExpense?.id;

    // Filter Records Related to Excluded Salary Expense from Task-Expense Table
    const excludedSalaryTaskExpenses = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .where("taskExpense.expenseId != :salaryExpenseId", { salaryExpenseId })
      .getMany();

    const excludedSalaryTaskExpenseIds = excludedSalaryTaskExpenses.map((taskExpense) => taskExpense.id);

    // Step 03 - Calculate Sum of Values for Each Month Based on Filtered Records using Task-Expenses Table
    const monthlyExpenses3 = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .select("SUM(taskExpense.value)", "totalExpense")
      .addSelect("DATE_FORMAT(taskExpense.createdDate, '%M %Y')", "monthYear")
      .where("taskExpense.id IN (:taskExpenseIds)", { taskExpenseIds: excludedSalaryTaskExpenseIds })
      .groupBy("monthYear")
      .getRawMany();


    // income Records by Months
    const groupedIncomeByMonthAndYear = await getRepository(IncomeEntity)
      .createQueryBuilder("income")
      .select([
        "CONCAT(income.month, ' ', YEAR(income.createdDate)) AS monthYear",
        "SUM(income.price) AS totalIncome"
      ])
      .where("income.landId = :landId", { landId })
      .groupBy("monthYear")
      .getRawMany();

    const allTaskAssignedIds = await (await getRepository(TaskAssignedEntity)
      .createQueryBuilder("taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("land.id = :landId", { landId })
      .select("taskAssigned.id")
      .getMany())
      .map(taskAssigned => taskAssigned.id);


    //total expenses
    const monthlyExpenses4 = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .select("SUM(taskExpense.value)", "totalExpense")
      .addSelect("DATE_FORMAT(taskExpense.createdDate, '%M %Y')", "monthYear")
      .where("taskExpense.taskAssignedId IN (:...allTaskAssignedIds)", { allTaskAssignedIds })
      .groupBy("monthYear")
      .getRawMany();


    const quantitySummary = workAssignedEntities.reduce((summary, workAssigned) => {
      const workDate = workAssigned.taskCard.workDate || workAssigned.startDate.toISOString().split("T")[0];
      const year = new Date(workDate).getFullYear();
      const month = new Date(workDate).toLocaleString('en-US', { month: 'long' });
      const key = `${month} ${year}`;

      if (!summary[key]) {
        summary[key] = 0;
      }

      summary[key] += workAssigned.quantity || 0;

      return summary;
    }, {});


    const combinedSummary = Object.entries(quantitySummary).map(([key, totalQuantity]) => {
      const [month, year] = key.split(' ');

      const expenseForMonth = monthlyExpenses.find(expense => expense.monthYear === `${month} ${year}`);
      const finalMonthlyExpenses = monthlyExpenses2.find(otherExpense => otherExpense.monthYear === `${month} ${year}`);
      const additionalMonthlyExpenses = monthlyExpenses3.find(taskExpense => taskExpense.monthYear === `${month} ${year}`);
      const incomeForMonth = groupedIncomeByMonthAndYear.find(income => income.monthYear === `${month} ${year}`);
      const taskExpenseForMonth = monthlyExpenses4.find(taskExpense => taskExpense.monthYear === `${month} ${year}`);

      const CIR = ((taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0) /
        (incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0)).toFixed(3);

      return {
        month,
        year,
        totalQuantity,
        PluckExpense: expenseForMonth ? parseFloat(expenseForMonth.totalExpense) : 0,
        OtherExpenses: finalMonthlyExpenses ? parseFloat(finalMonthlyExpenses.totalExpense) : 0,
        NonCrewExpenses: additionalMonthlyExpenses ? parseFloat(additionalMonthlyExpenses.totalExpense) : 0,
        TotalIncome: incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0,
        TaskExpenses: taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0,

        Profit: (incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0) - (taskExpenseForMonth ? parseFloat(taskExpenseForMonth.totalExpense) : 0),
        CIR: parseFloat(CIR),
      };
    });
    return combinedSummary;
  }
}

