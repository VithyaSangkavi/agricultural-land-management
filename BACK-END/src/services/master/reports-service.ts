export interface ReportService {
    generateEmployeeAttendanceReport(): Promise<any>;
    generateMonthlyCropReport(): Promise<any>;
    generateOtherCostYieldReport(): Promise<any>;
    getEmployeePerfomanceReport(): Promise<any>;
    getCostBreakdownLineReport(): Promise<any>;
    getCostBreakdownPieReport(): Promise<any>;
    getSummaryReport(landId: number): Promise<any>;
    // getSummaryReport(): Promise<any>;
  }
  