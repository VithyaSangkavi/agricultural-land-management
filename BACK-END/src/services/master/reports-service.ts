export interface ReportService {

    generateEmployeeAttendanceReport(): Promise<any>;
    generateMonthlyCropReport(): Promise<any>;
    generateOtherCostYieldReport(): Promise<any>;

    getEmployeePerfomanceReport(fromDate?: string, toDate?: string): Promise<any>;

    // getCostBreakdownLineReport(): Promise<any>;
    getCostBreakdownLineReport(landId: number): Promise<any>;

    getCostBreakdownPieReport(): Promise<any>;
    // getCostBreakdownPieReport(landId: number): Promise<any>;

    getSummaryReport(landId: number): Promise<any>;
  }
  