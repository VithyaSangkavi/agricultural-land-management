  export interface ReportService {
    generateEmployeeAttendanceReport(startDate?: Date, endDate?: Date, lotId?: number): Promise<any>;
    generateMonthlyCropReport(lotId?: number): Promise<any>;
    generateOtherCostYieldReport(): Promise<any>;
  }
  