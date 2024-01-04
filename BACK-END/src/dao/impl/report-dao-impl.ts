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

  //Monthly-crop report
  async generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date, landId: number): Promise<any> {
    const workAssignedRepository = getConnection().getRepository(WorkAssignedEntity);

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

        const currentYearStartDate = moment(startDate).toDate();
        const currentYearEndDate = moment(endDate).toDate();
        const pastYearStartDate = moment(startDate).subtract(1, 'year').startOf('year').toDate();
        const pastYearEndDate = moment(endDate).subtract(1, 'year').endOf('year').toDate();

        queryForCurrentYear.andWhere('work_assigned.updatedDate BETWEEN :currentYearStartDate AND :currentYearEndDate', { currentYearStartDate, currentYearEndDate });
        queryForPastYear.andWhere('work_assigned.updatedDate BETWEEN :pastYearStartDate AND :pastYearEndDate', { pastYearStartDate, pastYearEndDate });
      }

      if (landId) {
        queryForCurrentYear
          .innerJoin('work_assigned.lot', 'lot')
          .innerJoin('lot.land', 'land')
          .andWhere('land.id = :landId', { landId });

        queryForPastYear
          .innerJoin('work_assigned.lot', 'lot')
          .innerJoin('lot.land', 'land')
          .andWhere('land.id = :landId', { landId });
      }

      const quantitiesForCurrentYear = await queryForCurrentYear
        .groupBy('EXTRACT(MONTH FROM work_assigned.updatedDate)')
        .getRawMany();

      const quantitiesForPastYear = await queryForPastYear
        .groupBy('EXTRACT(MONTH FROM work_assigned.updatedDate)')
        .getRawMany();

      //console
      console.log('Current year: ', queryForCurrentYear.getSql());
      console.log('Past year: ', queryForPastYear.getSql());

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

      console.log(formattedQuantitiesForCurrentYear);
      console.log(formattedQuantitiesForPastYear);

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
  async generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any> {
    const taskExpenseRepository = getConnection().getRepository(TaskExpenseEntity);
    const incomeRepository = getConnection().getRepository(IncomeEntity);

    try {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const taskExpensesQuery = taskExpenseRepository.createQueryBuilder('task_expense')
        .select('SUM(task_expense.value)', 'cost')
        .addSelect('EXTRACT(MONTH FROM task_expense.createdDate)', 'month')

      const incomesQuery = incomeRepository.createQueryBuilder('income')
        .select('SUM(income.price)', 'yield')
        .addSelect('income.month')

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

      // filtering by landId
      if (landId) {
        taskExpensesQuery
          .innerJoin('task_expense.taskType', 'taskType')
          .innerJoin('taskType.crop', 'crop')
          .innerJoin('crop.land', 'land')
          .andWhere('land.id = :landId', { landId });

        incomesQuery.andWhere('income.landId = :landId', { landId });
      }

      // filtering by lotId
      if (lotId) {
        taskExpensesQuery
          .innerJoin('task_expense.taskType', 'taskType')
          .innerJoin('taskType.crop', 'crop')
          .innerJoin('crop.land', 'land')
          .innerJoin('land.lot', 'lot')
          .andWhere('lot.id = :lotId', { lotId });

        incomesQuery
          .innerJoin('income.land', 'land')
          .innerJoin('land.lot', 'lot')
          .andWhere('lot.id = :lotId', { lotId });
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

    const workAssignedRepository = getConnection().getRepository(WorkAssignedEntity);

    const workAssignedEntities = await workAssignedRepository
      .createQueryBuilder("workAssigned")
      .leftJoinAndSelect("workAssigned.taskCard", "taskCard")
      .leftJoinAndSelect("taskCard.taskAssigned", "taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("land.id = :landId", { landId })
      .getMany();

    const monthlyExpenses = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .innerJoin(TaskTypeEntity, "task", "task.taskName = :taskName AND task.id = taskAssigned.taskId", { taskName: "Pluck" })
      .where("land.id = :landId", { landId })
      .groupBy("DATE_FORMAT(taskExpense.createdDate, '%M %Y')")
      .select("DATE_FORMAT(taskExpense.createdDate, '%M %Y')", "monthYear")
      .addSelect("SUM(taskExpense.value)", "totalExpense")
      .getRawMany();


    const monthlyExpenses2 = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .innerJoin(TaskTypeEntity, "task", "task.taskName <> :pluckTaskName AND task.id = taskAssigned.taskId", { pluckTaskName: "Pluck" })
      .where("land.id = :landId", { landId })
      .groupBy("DATE_FORMAT(taskExpense.createdDate, '%M %Y')")
      .select("DATE_FORMAT(taskExpense.createdDate, '%M %Y')", "monthYear")
      .addSelect("SUM(taskExpense.value)", "totalExpense")
      .getRawMany();

    const monthlyExpenses3 = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskExpense.expense", "expense")
      .innerJoin("taskAssigned.land", "land")
      .where("expense.expenseType != :salaryExpenseType", { salaryExpenseType: "Salary" })
      .andWhere("land.id = :landId", { landId })
      .groupBy("DATE_FORMAT(taskExpense.createdDate, '%M %Y')")
      .select("DATE_FORMAT(taskExpense.createdDate, '%M %Y')", "monthYear")
      .addSelect("SUM(taskExpense.value)", "totalExpense")
      .getRawMany();

    const groupedIncomeByMonthAndYear = await getRepository(IncomeEntity)
      .createQueryBuilder("income")
      .select([
        "CONCAT(income.month, ' ', YEAR(income.createdDate)) AS monthYear",
        "SUM(income.price) AS totalIncome"
      ])
      .where("income.landId = :landId", { landId })
      .groupBy("monthYear")
      .getRawMany();

    const monthlyExpenses4 = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .select([
        "DATE_FORMAT(taskExpense.createdDate, '%M %Y') AS monthYear",
        "SUM(taskExpense.value) AS totalExpense"
      ])
      .where("land.id = :landId", { landId })
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
        (incomeForMonth ? parseFloat(incomeForMonth.totalIncome) : 0)).toFixed(2);

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


  //Total - weekly Summary Report
  async getWeeklySummaryReport(landId) {
    const workAssignedRepository = getConnection().getRepository(WorkAssignedEntity);

    const workAssignedEntities = await workAssignedRepository
      .createQueryBuilder("workAssigned")
      .leftJoinAndSelect("workAssigned.taskCard", "taskCard")
      .leftJoinAndSelect("taskCard.taskAssigned", "taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("land.id = :landId", { landId })
      .getMany();

    const weeklyExpenses = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .innerJoin(TaskTypeEntity, "task", "task.taskName = :taskName AND task.id = taskAssigned.taskId", { taskName: "Pluck" })
      .where("land.id = :landId", { landId })
      .groupBy("EXTRACT(YEAR FROM taskExpense.createdDate), EXTRACT(WEEK FROM taskExpense.createdDate)")
      .select([
        "EXTRACT(YEAR FROM taskExpense.createdDate) AS year",
        "EXTRACT(WEEK FROM taskExpense.createdDate) AS weekNumber",
        "SUM(taskExpense.value) AS totalExpense"
      ])
      .getRawMany();


    const weeklyExpenses2 = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .innerJoin(TaskTypeEntity, "task", "task.taskName <> :pluckTaskName AND task.id = taskAssigned.taskId", { pluckTaskName: "Pluck" })
      .where("land.id = :landId", { landId })
      .groupBy("EXTRACT(YEAR FROM taskExpense.createdDate), EXTRACT(WEEK FROM taskExpense.createdDate)")
      .select([
        "EXTRACT(YEAR FROM taskExpense.createdDate) AS year",
        "EXTRACT(WEEK FROM taskExpense.createdDate) AS weekNumber",
        "SUM(taskExpense.value) AS totalExpense"
      ])
      .getRawMany();


    const weeklyExpenses3 = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskExpense.expense", "expense")
      .innerJoin("taskAssigned.land", "land")
      .where("expense.expenseType != :salaryExpenseType", { salaryExpenseType: "Salary" })
      .andWhere("land.id = :landId", { landId })
      .groupBy("EXTRACT(YEAR FROM taskExpense.createdDate), EXTRACT(WEEK FROM taskExpense.createdDate)")
      .select([
        "EXTRACT(YEAR FROM taskExpense.createdDate) AS year",
        "EXTRACT(WEEK FROM taskExpense.createdDate) AS weekNumber",
        "SUM(taskExpense.value) AS totalExpense"
      ])
      .getRawMany();


    const quantitySummary = workAssignedEntities.reduce((summary, workAssigned) => {
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
  }

  //Total - weekly Summary Report
  async getDailySummaryReport(landId) {
    const workAssignedRepository = getConnection().getRepository(WorkAssignedEntity);

    const workAssignedEntities = await workAssignedRepository
      .createQueryBuilder("workAssigned")
      .leftJoinAndSelect("workAssigned.taskCard", "taskCard")
      .leftJoinAndSelect("taskCard.taskAssigned", "taskAssigned")
      .leftJoinAndSelect("taskAssigned.land", "land")
      .where("land.id = :landId", { landId })
      .getMany();

    const weeklyExpenses = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .innerJoin(TaskTypeEntity, "task", "task.taskName = :taskName AND task.id = taskAssigned.taskId", { taskName: "Pluck" })
      .where("land.id = :landId", { landId })
      .groupBy("EXTRACT(YEAR FROM taskExpense.createdDate), EXTRACT(MONTH FROM taskExpense.createdDate), EXTRACT(DAY FROM taskExpense.createdDate)")
      .select([
        "EXTRACT(YEAR FROM taskExpense.createdDate) AS year",
        "EXTRACT(MONTH FROM taskExpense.createdDate) AS monthNumber",
        "EXTRACT(DAY FROM taskExpense.createdDate) AS dayNumber",
        "SUM(taskExpense.value) AS totalExpense"
      ])
      .getRawMany();


    const weeklyExpenses2 = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskAssigned.land", "land")
      .innerJoin(TaskTypeEntity, "task", "task.taskName <> :pluckTaskName AND task.id = taskAssigned.taskId", { pluckTaskName: "Pluck" })
      .where("land.id = :landId", { landId })
      .groupBy("EXTRACT(YEAR FROM taskExpense.createdDate), EXTRACT(MONTH FROM taskExpense.createdDate), EXTRACT(DAY FROM taskExpense.createdDate)")
      .select([
        "EXTRACT(YEAR FROM taskExpense.createdDate) AS year",
        "EXTRACT(MONTH FROM taskExpense.createdDate) AS monthNumber",
        "EXTRACT(DAY FROM taskExpense.createdDate) AS dayNumber",
        "SUM(taskExpense.value) AS totalExpense"
      ])
      .getRawMany();


    const weeklyExpenses3 = await getRepository(TaskExpenseEntity)
      .createQueryBuilder("taskExpense")
      .innerJoin("taskExpense.taskAssigned", "taskAssigned")
      .innerJoin("taskExpense.expense", "expense")
      .innerJoin("taskAssigned.land", "land")
      .where("expense.expenseType != :salaryExpenseType", { salaryExpenseType: "Salary" })
      .andWhere("land.id = :landId", { landId })
      .groupBy("EXTRACT(YEAR FROM taskExpense.createdDate), EXTRACT(MONTH FROM taskExpense.createdDate), EXTRACT(DAY FROM taskExpense.createdDate)")
      .select([
        "EXTRACT(YEAR FROM taskExpense.createdDate) AS year",
        "EXTRACT(MONTH FROM taskExpense.createdDate) AS monthNumber",
        "EXTRACT(DAY FROM taskExpense.createdDate) AS dayNumber",
        "SUM(taskExpense.value) AS totalExpense"
      ])
      .getRawMany();


    const quantitySummary = workAssignedEntities.reduce((summary, workAssigned) => {
      const workDate = workAssigned.taskCard.workDate || workAssigned.startDate.toISOString().split("T")[0];
      const date = moment(workDate).format("YYYY-MM-DD");

      if (!summary[date]) {
        summary[date] = 0;
      }

      summary[date] += workAssigned.quantity || 0;

      return summary;
    }, {});

    const combinedSummary = Object.entries(quantitySummary).map(([date, totalQuantity]) => {
      const expenseForDate = weeklyExpenses.find(expense => expense.date === date);
      const finalDailyExpenses = weeklyExpenses2.find(otherExpense => otherExpense.date === date);
      const additionalDailyExpenses = weeklyExpenses3.find(taskExpense => taskExpense.date === date);

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
  }
}