  export interface ReportService {
    generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number): Promise<any>;
    generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date): Promise<any>;
    generateOtherCostYieldReport(startDate: Date, endDate: Date): Promise<any>;
  }