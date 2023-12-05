import { ReportDao } from '../../../dao/report-dao';
import { ReportService } from '../reports-service';
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
  private reportDao: ReportDao;

  constructor(reportDao: ReportDao) {
    this.reportDao = reportDao;
  }

  //employee-attendance report
  async generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number): Promise<any[]> {
    return this.reportDao.generateEmployeeAttendanceReport(startDate, endDate, lotId);
  }
  
  //monthly-crop report
  async generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date): Promise<any[]> {
    return this.reportDao.generateMonthlyCropReport(lotId, startDate, endDate);
  }

  //other-cost-yield report
  async generateOtherCostYieldReport(startDate: Date, endDate: Date): Promise<any[]> {
    return this.reportDao.generateOtherCostYieldReport(startDate, endDate);
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