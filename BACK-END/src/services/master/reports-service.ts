  export interface ReportService {
    generateEmployeeAttendanceReport(startDate?: Date, endDate?: Date): Promise<any>;
    generateMonthlyCropReport(): Promise<any>;
    generateOtherCostYieldReport(): Promise<any>;
  }
  