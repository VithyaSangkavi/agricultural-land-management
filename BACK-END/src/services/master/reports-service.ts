export interface ReportService {

    generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number): Promise<any>;
    generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date): Promise<any>;
    generateOtherCostYieldReport(startDate: Date, endDate: Date): Promise<any>;
    getEmployeePerfomanceReport(): Promise<any>;
    getCostBreakdownLineReport(): Promise<any>;
    getCostBreakdownPieReport(): Promise<any>;
    getSummaryReport(landId: number): Promise<any>;
    // getSummaryReport(): Promise<any>;
  }