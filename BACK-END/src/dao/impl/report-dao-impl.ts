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

import moment from 'moment';
import { LandEntity } from '../../entity/master/land-entity';
import { format, parse } from 'date-fns';
export class ReportDaoImpl implements ReportDao {

  //employee-attendance report
  async generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number, landId: number): Promise<any> {
    const workAssignedRepository = getConnection().getRepository(WorkAssignedEntity);
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

    // Filter by landId
    if (landId) {
      query = query
        .innerJoin('work_assigned.lot', 'lot')
        .innerJoin('lot.land', 'land')
        .andWhere('land.id = :landId', { landId });
    }

    try {
      const employeeAttendance = await query.getRawMany();
      return employeeAttendance;
    } catch (error) {
      throw new Error(`Error fetching employee attendance: ${error}`);
    }
  }

  //monthly-crop report

  async getCurrentYearQuantityForMonthlyCrop(currentYear: number, lotId?: number, startDate?: Date, endDate?: Date, landId?: number): Promise<any> {
    const workAssignedRepository = getConnection().getRepository(WorkAssignedEntity);
    let query = workAssignedRepository.createQueryBuilder('work_assigned')
      .leftJoin(TaskTypeEntity, 'task', 'work_assigned.taskId = task.id')
      .leftJoin(CropEntity, 'crop', 'task.cropId = crop.id')
      .select('SUM(work_assigned.quantity)', 'totalQuantity')
      .addSelect('EXTRACT(MONTH FROM work_assigned.updatedDate)', 'month')
      .where('EXTRACT(YEAR FROM work_assigned.updatedDate) = :currentYear', { currentYear })
      .where(`EXTRACT(YEAR FROM work_assigned.updatedDate) = ${currentYear}`)
      .groupBy('EXTRACT(MONTH FROM work_assigned.updatedDate)');

    if (lotId !== undefined) {
      query = query.andWhere('work_assigned.lotId = :lotId', { lotId });
    }

    if (startDate && endDate) {
      query = query.andWhere('work_assigned.updatedDate BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    if (landId) {
      query = query
        .innerJoin('work_assigned.lot', 'lot')
        .innerJoin('lot.land', 'land')
        .andWhere('land.id = :landId', { landId });
    }

    const result = query.getRawMany();
    return result;
  }

  async getPastYearQuantityForMonthlyCrop(pastYear: number, lotId?: number, startDate?: Date, endDate?: Date, landId?: number): Promise<any> {
    const workAssignedRepository = getConnection().getRepository(WorkAssignedEntity);
    let query = workAssignedRepository.createQueryBuilder('work_assigned')
      .leftJoin(TaskTypeEntity, 'task', 'work_assigned.taskId = task.id')
      .leftJoin(CropEntity, 'crop', 'task.cropId = crop.id')
      .select('SUM(work_assigned.quantity)', 'totalQuantity')
      .addSelect('EXTRACT(MONTH FROM work_assigned.updatedDate)', 'month')
      .where('EXTRACT(YEAR FROM work_assigned.updatedDate) = :pastYear', { pastYear })
      .groupBy('EXTRACT(MONTH FROM work_assigned.updatedDate)');

    if (lotId !== undefined) {
      query = query.andWhere('work_assigned.lotId = :lotId', { lotId });
    }

    if (startDate && endDate) {
      query = query.andWhere('work_assigned.updatedDate BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    if (landId) {
      query = query
        .innerJoin('work_assigned.lot', 'lot')
        .innerJoin('lot.land', 'land')
        .andWhere('land.id = :landId', { landId });
    }

    const result = query.getRawMany();
    return result;
  }

  //Other cost / yield report

  async getTaskExpenseForCostYield(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any> {
    const taskExpenseRepository = getConnection().getRepository(TaskExpenseEntity);

    const taskExpensesQuery = taskExpenseRepository.createQueryBuilder('task_expense')
      .select('SUM(task_expense.value)', 'cost')
      .addSelect('EXTRACT(MONTH FROM task_expense.createdDate)', 'month')

    // Filter by date range
    if (startDate && endDate) {
      taskExpensesQuery.andWhere('task_expense.createdDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // filtering by landId
    if (landId) {
      taskExpensesQuery
        .innerJoin('task_expense.taskType', 'taskType')
        .innerJoin('taskType.crop', 'crop')
        .innerJoin('crop.land', 'land')
        .andWhere('land.id = :landId', { landId });
    }

    // filtering by lotId
    if (lotId) {
      taskExpensesQuery
        .innerJoin('task_expense.taskType', 'taskType')
        .innerJoin('taskType.crop', 'crop')
        .innerJoin('crop.land', 'land')
        .innerJoin('land.lot', 'lot')
        .andWhere('lot.id = :lotId', { lotId });
    }

    const taskExpenses = await taskExpensesQuery
      .groupBy('EXTRACT(MONTH FROM task_expense.createdDate)')
      .getRawMany();

    return taskExpenses;
  }

  async getIncomeForCostYield(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any> {
    const incomeRepository = getConnection().getRepository(IncomeEntity);

    const incomesQuery = incomeRepository.createQueryBuilder('income')
      .select('SUM(income.price)', 'yield')
      .addSelect('income.month')

    // Filter by date range
    if (startDate && endDate) {
      incomesQuery.andWhere('income.createdDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // filtering by landId
    if (landId) {
      incomesQuery.andWhere('income.landId = :landId', { landId });
    }

    // filtering by lotId
    if (lotId) {
      incomesQuery
        .innerJoin('income.land', 'land')
        .innerJoin('land.lot', 'lot')
        .andWhere('lot.id = :lotId', { lotId });
    }

    const incomes = await incomesQuery
      .groupBy('income.month')
      .getRawMany();

    return incomes;
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

    console.log('Employee performance: ', query.getQueryAndParameters());

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
      .leftJoin('taskAssigned.land', 'land')
      .groupBy('DATE_FORMAT(te.createdDate, "%Y-%b"), e.expenseType')

    if (landId !== null && landId !== undefined) {
      query.where('land.id = :landId', { landId });
    }

    if (fromDate) {
      query.andWhere('DATE_FORMAT(te.createdDate, "%Y-%m") = :yearMonth', { yearMonth: fromDate });
    }

    console.log('cost breakdown : ', query.getQueryAndParameters());

    const result = await query

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

  //Monthly Summary Report - Start

  async getWorkAssignedEntity(landId?: number, fromDate?: string): Promise<WorkAssignedEntity[]> {

    console.log("dao date: ", fromDate);
    const workAssignedRepository = getConnection().getRepository(WorkAssignedEntity);

    let queryBuilder = workAssignedRepository
      .createQueryBuilder("workAssigned")
      .leftJoinAndSelect("workAssigned.taskCard", "taskCard")
      .leftJoinAndSelect("taskCard.taskAssigned", "taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("workAssigned.status = :status", { status: "online" })

    if (landId !== undefined) {
      queryBuilder = queryBuilder.andWhere("land.id = :landId", { landId });
    }

    const workAssignedEntities = await queryBuilder
      .distinct(true)
      .getMany();

    // console.log(workAssignedEntities)

    return workAssignedEntities;
  }


  async getPluckExpense(landId?: number, fromDate?: string): Promise<any[]> {
    const queryBuilder = getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .innerJoin(TaskTypeEntity, "task", "task.taskName = :taskName AND task.id = taskAssigned.taskId", { taskName: "Pluck" });

    if (landId !== undefined) {
      queryBuilder.where("land.id = :landId", { landId });
    }

    if (fromDate !== undefined) {
      queryBuilder.andWhere("DATE_FORMAT(taskExpense.createdDate, '%Y-%m') = :fromDate", { fromDate });
    }

    const monthlyExpenses = await queryBuilder
      .groupBy("DATE_FORMAT(taskExpense.createdDate, '%M %Y')")
      .select("DATE_FORMAT(taskExpense.createdDate, '%M %Y')", "monthYear")
      .addSelect("SUM(taskExpense.value)", "totalExpense")
      .distinct(true)
      .getRawMany();

    // console.log(monthlyExpenses);

    return monthlyExpenses;
  }



  async getOtherExpenses(landId?: number, fromDate?: string): Promise<any[]> {
    const queryBuilder = getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .innerJoin(TaskTypeEntity, "task", "task.taskName <> :pluckTaskName AND task.id = taskAssigned.taskId", { pluckTaskName: "Pluck" });

    if (landId !== undefined) {
      queryBuilder.where("land.id = :landId", { landId });
    }

    if (fromDate !== undefined) {
      queryBuilder.andWhere("DATE_FORMAT(taskExpense.createdDate, '%Y-%m') = :fromDate", { fromDate });
    }

    const monthlyExpenses2 = await queryBuilder
      .groupBy("DATE_FORMAT(taskExpense.createdDate, '%M %Y')")
      .select("DATE_FORMAT(taskExpense.createdDate, '%M %Y')", "monthYear")
      .addSelect("SUM(taskExpense.value)", "totalExpense")
      .distinct(true)
      .getRawMany();

    // console.log(monthlyExpenses2);

    return monthlyExpenses2;
  }


  async getNonCrewExpenses(landId?: number, fromDate?: string): Promise<any[]> {
    const queryBuilder = getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskExpense.expense", "expense")
      .innerJoin("taskAssigned.land", "land")
      .where("expense.expenseType != :salaryExpenseType", { salaryExpenseType: "Salary" });

    if (landId !== undefined) {
      queryBuilder.andWhere("land.id = :landId", { landId });
    }

    if (fromDate !== undefined) {
      queryBuilder.andWhere("DATE_FORMAT(taskExpense.createdDate, '%Y-%m') = :fromDate", { fromDate });
    }

    const monthlyExpenses3 = await queryBuilder
      .groupBy("DATE_FORMAT(taskExpense.createdDate, '%M %Y')")
      .select("DATE_FORMAT(taskExpense.createdDate, '%M %Y')", "monthYear")
      .addSelect("SUM(taskExpense.value)", "totalExpense")
      .distinct(true)
      .getRawMany();

    // console.log(monthlyExpenses3);

    return monthlyExpenses3;
  }


  async getTotalIncome(landId?: number, fromDate?: string): Promise<any[]> {
    const queryBuilder = getRepository(IncomeEntity)
      .createQueryBuilder("income")
      .select([
        "CONCAT(income.month, ' ', YEAR(income.createdDate)) AS monthYear",
        "SUM(income.price) AS totalIncome"
      ])
      .distinct(true);

    if (landId !== undefined) {
      queryBuilder.where("income.landId = :landId", { landId });
    }

    if (fromDate !== undefined) {
      const parsedDate = parse(fromDate, 'yyyy-MM', new Date());
      const formattedFromDate = format(parsedDate, 'MMMM yyyy');

      console.log(formattedFromDate);

      queryBuilder.andWhere("CONCAT(income.month, ' ', YEAR(income.createdDate)) = :yearMonthFromDate", { yearMonthFromDate: formattedFromDate });
    }

    const groupedIncomeByMonthAndYear = await queryBuilder
      .groupBy("monthYear")
      .getRawMany();

    // console.log(groupedIncomeByMonthAndYear);

    return groupedIncomeByMonthAndYear;
  }


  async getTaskExpenses(landId?: number, fromDate?: string): Promise<any[]> {
    const queryBuilder = getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .select([
        "DATE_FORMAT(taskExpense.createdDate, '%M %Y') AS monthYear",
        "SUM(taskExpense.value) AS totalExpense"
      ])
      .distinct(true);

    if (landId !== undefined) {
      queryBuilder.where("land.id = :landId", { landId });
    }

    if (fromDate !== undefined) {
      queryBuilder.andWhere("DATE_FORMAT(taskExpense.createdDate, '%Y-%m') = :fromDate", { fromDate });
    }

    const monthlyExpenses4 = await queryBuilder
      .groupBy("monthYear")
      .getRawMany();

    console.log(monthlyExpenses4);


    return monthlyExpenses4;
  }

  //Total - weekly Summary Report

  async getWorkAssignedEntityForWeek(landId?: number, fromDate?: string, toDate?: string): Promise<WorkAssignedEntity[]> {
    const workAssignedRepository = getConnection().getRepository(WorkAssignedEntity);

    let queryBuilder = workAssignedRepository
      .createQueryBuilder("workAssigned")
      .leftJoinAndSelect("workAssigned.taskCard", "taskCard")
      .leftJoinAndSelect("taskCard.taskAssigned", "taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("workAssigned.status = :status", { status: "online" })

    if (landId !== undefined) {
      queryBuilder = queryBuilder.andWhere("land.id = :landId", { landId });
    }

    const workAssignedEntities = await queryBuilder
      .getMany();

    // console.log(workAssignedEntities)

    return workAssignedEntities;
  }



  async getPluckExpenseWeek(landId?: number, fromDate?: string, toDate?: string): Promise<any[]> {

    // console.log("pluck expense date: ", fromDate, toDate);

    const queryBuilder = getRepository(TaskExpenseEntity)
      .createQueryBuilder('taskExpense')
      .innerJoin(TaskAssignedEntity, 'taskAssigned', 'taskAssigned.id = taskExpense.taskAssignedId')
      .innerJoin(LandEntity, 'land', 'land.id = taskAssigned.landId')
      .innerJoin(TaskTypeEntity, 'taskType', 'taskType.taskName = :taskName AND taskType.id = taskAssigned.taskId', { taskName: 'Pluck' });

    if (landId !== undefined) {
      queryBuilder.andWhere('land.id = :landId', { landId });
    }

    if (fromDate && toDate) {

      queryBuilder.andWhere('taskExpense.createdDate BETWEEN :fromDate AND :toDate', { fromDate, toDate });
    }

    const weeklyExpenses = await queryBuilder
      .groupBy('EXTRACT(YEAR FROM taskExpense.createdDate), WEEK(taskExpense.createdDate, 3)')
      .select([
        'EXTRACT(YEAR FROM taskExpense.createdDate) AS year',
        '(WEEK(taskExpense.createdDate, 3)) AS weekNumber',
        'SUM(taskExpense.value) AS totalExpense',
      ])
      .getRawMany();

    // console.log("pluck expense : ", weeklyExpenses);

    return weeklyExpenses;
  }



  async getOtherExpensesWeek(landId?: number, fromDate?: string, toDate?: string): Promise<any[]> {
    const queryBuilder = getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .innerJoin(TaskTypeEntity, "task", "task.taskName <> :pluckTaskName AND task.id = taskAssigned.taskId", { pluckTaskName: "Pluck" });

    if (landId !== undefined) {
      queryBuilder.andWhere("land.id = :landId", { landId });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere("taskExpense.createdDate BETWEEN :fromDate AND :toDate", { fromDate, toDate });
    }

    const weeklyExpenses2 = await queryBuilder
      .groupBy("EXTRACT(YEAR FROM taskExpense.createdDate), WEEK(taskExpense.createdDate, 3)")
      .select([
        "EXTRACT(YEAR FROM taskExpense.createdDate) AS year",
        '(WEEK(taskExpense.createdDate, 3)) AS weekNumber',
        "SUM(taskExpense.value) AS totalExpense"
      ])
      .getRawMany();

    // console.log(" expense : ", weeklyExpenses2);

    return weeklyExpenses2;
  }


  async getNonCrewExpensesWeek(landId?: number, fromDate?: string, toDate?: string): Promise<any[]> {
    const queryBuilder = getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskExpense.expense", "expense")
      .innerJoin("taskAssigned.land", "land")
      .where("expense.expenseType != :salaryExpenseType", { salaryExpenseType: "Salary" });

    if (landId !== undefined) {
      queryBuilder.andWhere("land.id = :landId", { landId });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere("taskExpense.createdDate BETWEEN :fromDate AND :toDate", { fromDate, toDate });
    }

    const weeklyExpenses3 = await queryBuilder
      .groupBy("EXTRACT(YEAR FROM taskExpense.createdDate), WEEK(taskExpense.createdDate, 3)")
      .select([
        "EXTRACT(YEAR FROM taskExpense.createdDate) AS year",
        '(WEEK(taskExpense.createdDate, 3)) AS weekNumber',
        "SUM(taskExpense.value) AS totalExpense"
      ])
      .getRawMany();

    // console.log("Non-Crew", weeklyExpenses3);

    return weeklyExpenses3;
  }


  //Total - daily Summary Report

  async getWorkAssignedEntityForDay(landId?: number, fromDate?: string, toDate?: string): Promise<WorkAssignedEntity[]> {
    const workAssignedRepository = getConnection().getRepository(WorkAssignedEntity);

    let queryBuilder = workAssignedRepository
      .createQueryBuilder("workAssigned")
      .leftJoinAndSelect("workAssigned.taskCard", "taskCard")
      .leftJoinAndSelect("taskCard.taskAssigned", "taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("workAssigned.status = :status", { status: "online" })

    if (landId !== undefined) {
      queryBuilder = queryBuilder.andWhere("land.id = :landId", { landId });
    }

    const workAssignedEntities = await queryBuilder.getMany();

    // console.log("Day", workAssignedEntities);

    return workAssignedEntities;
  }


  async getPluckExpenseDay(landId?: number, fromDate?: string, toDate?: string): Promise<any[]> {

    const queryBuilder = getRepository(TaskExpenseEntity)
      .createQueryBuilder('taskExpense')
      .innerJoin(TaskAssignedEntity, 'taskAssigned', 'taskAssigned.id = taskExpense.taskAssignedId')
      .innerJoin(LandEntity, 'land', 'land.id = taskAssigned.landId')
      .innerJoin(TaskTypeEntity, 'task', 'task.taskName = :taskName AND task.id = taskAssigned.taskId', { taskName: 'Pluck' });

    if (landId !== undefined) {
      queryBuilder.andWhere('land.id = :landId', { landId });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere('DATE(taskExpense.createdDate) BETWEEN :fromDate AND :toDate', { fromDate, toDate });
    }

    const dailyExpenses = await queryBuilder
      .groupBy('DATE_FORMAT(taskExpense.createdDate, "%Y-%m-%d")')
      .select([
        'DATE_FORMAT(taskExpense.createdDate, "%Y-%m-%d") AS formattedDate',
        'SUM(taskExpense.value) AS totalExpense',
      ])
      .getRawMany();

    // console.log('pluck', dailyExpenses);

    return dailyExpenses;
  }


  async getOtherExpensesDay(landId?: number, fromDate?: string, toDate?: string): Promise<any[]> {
    const queryBuilder = getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .innerJoin(TaskTypeEntity, "task", "task.taskName <> :pluckTaskName AND task.id = taskAssigned.taskId", { pluckTaskName: "Pluck" });

    if (landId !== undefined) {
      queryBuilder.andWhere("land.id = :landId", { landId });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere('DATE(taskExpense.createdDate) BETWEEN :fromDate AND :toDate', { fromDate, toDate });
    }

    const dailyExpenses2 = await queryBuilder
      .groupBy('DATE_FORMAT(taskExpense.createdDate, "%Y-%m-%d")')
      .select([
        'DATE_FORMAT(taskExpense.createdDate, "%Y-%m-%d") AS formattedDate',
        'SUM(taskExpense.value) AS totalExpense',
      ])
      .getRawMany();

    // console.log("other", dailyExpenses2);

    return dailyExpenses2;
  }


  async getNonCrewExpensesDay(landId?: number, fromDate?: string, toDate?: string): Promise<any[]> {
    const queryBuilder = getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskExpense.expense", "expense")
      .innerJoin("taskAssigned.land", "land")
      .where("expense.expenseType != :salaryExpenseType", { salaryExpenseType: "Salary" });

    if (landId !== undefined) {
      queryBuilder.andWhere("land.id = :landId", { landId });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere('DATE(taskExpense.createdDate) BETWEEN :fromDate AND :toDate', { fromDate, toDate });
    }

    const dailyExpenses3 = await queryBuilder
      .groupBy('DATE_FORMAT(taskExpense.createdDate, "%Y-%m-%d")')
      .select([
        'DATE_FORMAT(taskExpense.createdDate, "%Y-%m-%d") AS formattedDate',
        'SUM(taskExpense.value) AS totalExpense',
      ])
      .getRawMany();

    console.log("other", dailyExpenses3);

    return dailyExpenses3;
  }

}