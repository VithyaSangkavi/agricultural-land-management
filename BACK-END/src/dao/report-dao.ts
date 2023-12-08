export interface ReportDao {
  generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number): Promise<any[]>;
  generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date): Promise<any[]>;
  generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number): Promise<any[]>;
  getEmployeePerfomanceReport(fromDate: string, toDate: string, landId: number): Promise<any>;
  getCostBreakdownLineReport(fromDate:string, landId: number): Promise<any>;
  getCostBreakdownPieReport(): Promise<any>;
  getSummaryReport(landId: number): Promise<any>
  
}