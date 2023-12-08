import { getConnection, getRepository, Repository } from 'typeorm';
import { WorkAssignedEntity } from '../../entity/master/work-assigned-entity';
import { TaskTypeEntity } from '../../entity/master/task-type-entity';
import { CropEntity } from '../../entity/master/crop-entity';
import { TaskExpenseEntity } from '../../entity/master/task-expense-entity';
import { IncomeEntity } from '../../entity/master/income-entity';
import { ReportDao } from "../report-dao";
import { TaskCardEntity } from '../../entity/master/task-card-entity';
import { TaskAssignedEntity } from '../../entity/master/task-assigned-entity';
import { WorkerEntity } from '../../entity/master/worker-entity';
import { ExpensesEntity } from '../../entity/master/expense-entity';

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

  //Employee Perfomance Report
  async getEmployeePerfomanceReport(fromDate?: string, toDate?: string, landId?: number): Promise<any> {

    const connection = getConnection();
    const queryBuilder = connection.createQueryBuilder();
    console.log("ser-imp : ", fromDate, toDate);
    console.log("ser-imp land: ", landId);

    const query = queryBuilder
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
      .innerJoin(WorkerEntity, "worker", "workAssigned.workerId = worker.id");

    if (landId !== null && landId !== undefined) {
      query
        .innerJoin('taskAssigned.land', 'land')
        .where('land.id = :landId', { landId })
        .andWhere("taskType.taskName = :taskName", { taskName: "Pluck" });
    } else {
      query.where("taskType.taskName = :taskName", { taskName: "Pluck" });
    }

    if (fromDate && toDate) {
      query.andWhere(
        `CASE WHEN taskAssigned.schedule = 'Scheduled' THEN taskCard.workDate ELSE DATE(workAssigned.updatedDate) END BETWEEN :fromDate AND :toDate`,
        { fromDate, toDate }
      );
    }

    const result = await query
      .orderBy("workDate", "ASC")
      .getRawMany();

    return result;
  }


  //Cost Breakdown Line Report
  // async getCostBreakdownLineReport(landId: number): Promise<any> {
  //   const connection = getConnection();
  //   const queryBuilder = connection.createQueryBuilder();

  //   console.log("back-end landId : ", landId)

  //   const query = queryBuilder
  //     .select([
  //       'DATE_FORMAT(te.createdDate, "%M") AS month',
  //       'SUM(te.value) AS totalCost',
  //       'e.expenseType AS expenseType',
  //     ])
  //     .from(TaskExpenseEntity, 'te')
  //     .leftJoin('te.expense', 'e')
  //     .leftJoin('te.taskAssigned', 'taskAssigned')
  //     .leftJoin('taskAssigned.land', 'land');

  //   if (landId !== null && landId !== undefined) {
  //     query.where('land.id = :landId', { landId });
  //   }

  //   const result = await query
  //     .groupBy('DATE_FORMAT(te.createdDate, "%M"), e.expenseType')
  //     .orderBy('month', 'DESC')
  //     .getRawMany();

  //   return result;
  // }

  async getCostBreakdownLineReport(fromDate?: string, landId?: number): Promise<any> {
    const connection = getConnection();
    const queryBuilder = connection.createQueryBuilder();

    console.log("back-end landId : ", landId);
    console.log("ser-imp date: ", fromDate);

    const query = queryBuilder
      .select([
        'DATE_FORMAT(te.createdDate, "%Y-%b") AS yearMonth',
        'SUM(te.value) AS totalCost',
        'e.expenseType AS expenseType',
      ])
      .from(TaskExpenseEntity, 'te')
      .leftJoin('te.expense', 'e')
      .leftJoin('te.taskAssigned', 'taskAssigned')
      .leftJoin('taskAssigned.land', 'land');

    if (landId !== null && landId !== undefined) {
      query.where('land.id = :landId', { landId });
    }

    if (fromDate) {
      query.andWhere('DATE_FORMAT(te.createdDate, "%Y-%m") = :yearMonth', { yearMonth: fromDate });
    }

    const result = await query
      .groupBy('DATE_FORMAT(te.createdDate, "%Y-%b"), e.expenseType')
      .orderBy('yearMonth', 'DESC')
      .getRawMany();

    return result;
  }



  //Cost Breakdown Pie Report
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

  //Total - Monthly Summary Report
  async getSummaryReport(landId?: number, cateNum?: number): Promise<any> {

    console.log("catenum dao-impl : ", cateNum);
    console.log("landnum dao-impl : ", cateNum);

    const workAssignedRepository = getRepository(WorkAssignedEntity);

    const workAssignedEntities = await workAssignedRepository
      .createQueryBuilder("workAssigned")
      .leftJoinAndSelect("workAssigned.taskCard", "taskCard")
      .leftJoinAndSelect("taskCard.taskAssigned", "taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("land.id = :landId", { landId })
      .getMany();


    const pluckTaskIds = await (await getRepository(TaskTypeEntity)
      .createQueryBuilder("task")
      .where("task.taskName = :taskName", { taskName: "Pluck" })
      .select("task.id")
      .getMany())
      .map(task => task.id);


    const taskAssignedIds = await (await getRepository(TaskAssignedEntity)
      .createQueryBuilder("taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("land.id = :landId", { landId })
      .andWhere("taskAssigned.taskId IN (:...pluckTaskIds)", { pluckTaskIds })
      .select("taskAssigned.id")
      .getMany())
      .map(taskAssigned => taskAssigned.id);


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