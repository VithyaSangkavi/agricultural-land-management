export interface ReportService {

    generateEmployeeAttendanceReport(): Promise<any>;
    generateMonthlyCropReport(): Promise<any>;
    generateOtherCostYieldReport(): Promise<any>;
    getEmployeePerfomanceReport(fromDate?: string, toDate?: string, landId?: number): Promise<any>;
    getCostBreakdownLineReport(landId: number): Promise<any>;
    getCostBreakdownPieReport(): Promise<any>;
    getSummaryReport(landId: number): Promise<any>;
  }
  