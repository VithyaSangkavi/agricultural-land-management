  export interface ReportService {
    generateEmployeeAttendanceReport(startDate?: Date, endDate?: Date, lotId?: number): Promise<any>;
    generateMonthlyCropReport(): Promise<any>;
    generateOtherCostYieldReport(): Promise<any>;
  }
  