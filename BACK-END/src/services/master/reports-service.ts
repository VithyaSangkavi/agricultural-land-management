export interface ReportService {
    generateEmployeeAttendanceReport(): Promise<any>;
    generateMonthlyCropReport(): Promise<any>;
    generateOtherCostYieldReport(): Promise<any>;
  }
  