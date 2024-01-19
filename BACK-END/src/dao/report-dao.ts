import { TaskExpenseEntity } from "../entity/master/task-expense-entity";
import { WorkAssignedEntity } from "../entity/master/work-assigned-entity";

export interface ReportDao {
  generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number, landId: number): Promise<any[]>;
  //generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date, landId: number): Promise<any[]>;
  //generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any[]>;
  getEmployeePerfomanceReport(fromDate: string, toDate: string, landId: number): Promise<any>;
  getCostBreakdownLineReport(fromDate:string, landId: number): Promise<any>;
  getCostBreakdownPieReport(): Promise<any>;

  getWorkAssignedEntity(landId?: number, fromDate?: string): Promise<WorkAssignedEntity[]>
  getPluckExpense(landId?: number, fromDate?: string): Promise<any[]>
  getOtherExpenses(landId?: number, fromDate?: string): Promise<any[]>
  getNonCrewExpenses(landId?: number, fromDate?: string): Promise<any[]>
  getTotalIncome(landId?: number, fromDate?: string): Promise<any[]>
  getTaskExpenses(landId?: number, fromDate?: string): Promise<any[]>

  getWorkAssignedEntityForWeek(landId?: number, fromDate?: string, toDate?: string): Promise<WorkAssignedEntity[]>
  getPluckExpenseWeek(landId?: number, fromDate?: string, toDate?: string): Promise<any[]>
  getOtherExpensesWeek(landId?: number, fromDate?: string, toDate?: string): Promise<any[]>
  getNonCrewExpensesWeek(landId?: number, fromDate?: string, toDate?: string): Promise<any[]>

  getWorkAssignedEntityForDay(landId?: number, fromDate?: string, toDate?: string): Promise<WorkAssignedEntity[]>
  getPluckExpenseDay(landId?: number, fromDate?: string, toDate?: string): Promise<any[]>
  getOtherExpensesDay(landId?: number, fromDate?: string, toDate?: string): Promise<any[]>
  getNonCrewExpensesDay(landId?: number, fromDate?: string, toDate?: string): Promise<any[]>

  getCurrentYearQuantityForMonthlyCrop(currentYear: number, lotId?: number, startDate?: Date, endDate?: Date, landId?: number): Promise<any>;
  getPastYearQuantityForMonthlyCrop(pastYear: number, lotId?: number, startDate?: Date, endDate?: Date, landId?: number): Promise<any>;
  getTaskExpenseForCostYield(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any>;
  getIncomeForCostYield(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any>;
}