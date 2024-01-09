import { TaskExpenseEntity } from "../entity/master/task-expense-entity";
import { WorkAssignedEntity } from "../entity/master/work-assigned-entity";

export interface ReportDao {
  generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number, landId: number): Promise<any[]>;
  //generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date, landId: number): Promise<any[]>;
  //generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any[]>;
  getEmployeePerfomanceReport(fromDate: string, toDate: string, landId: number): Promise<any>;
  getCostBreakdownLineReport(fromDate:string, landId: number): Promise<any>;
  getCostBreakdownPieReport(): Promise<any>;
  getWorkAssignedEntity(landId?: number): Promise<WorkAssignedEntity[]>
  getPluckExpense(landId?: number): Promise<any[]>
  getOtherExpenses(landId?: number): Promise<any[]>
  getNonCrewExpenses(landId?: number): Promise<any[]>
  getTotalIncome(landId?: number): Promise<any[]>
  getTaskExpenses(landId?: number): Promise<any[]>

  getWorkAssignedEntityForWeek(landId?: number): Promise<WorkAssignedEntity[]>
  getPluckExpenseWeek(landId?: number): Promise<any[]>
  getOtherExpensesWeek(landId?: number): Promise<any[]>
  getNonCrewExpensesWeek(landId?: number): Promise<any[]>

  getWorkAssignedEntityForDay(landId?: number): Promise<WorkAssignedEntity[]>
  getPluckExpenseDay(landId?: number): Promise<any[]>
  getOtherExpensesDay(landId?: number): Promise<any[]>
  getNonCrewExpensesDay(landId?: number): Promise<any[]>

  getCurrentYearQuantityForMonthlyCrop(currentYear: number, lotId?: number, startDate?: Date, endDate?: Date, landId?: number): Promise<any>;
  getPastYearQuantityForMonthlyCrop(pastYear: number, lotId?: number, startDate?: Date, endDate?: Date, landId?: number): Promise<any>;
  getTaskExpenseForCostYield(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any>;
  getIncomeForCostYield(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any>;
}