export interface ReportService {

    getEmployeePerfomanceReport(fromDate?: string, toDate?: string, landId?: number): Promise<any>;
    generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number, landId: number): Promise<any>;
    generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date, landId: number): Promise<any>;
    generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any>;
    getCostBreakdownLineReport(fromDate?: string, landId?: number): Promise<any>;
    getCostBreakdownPieReport(): Promise<any>;
    getSummaryReport(landId?: number, cateNum?: number): Promise<any>;   
  }
  