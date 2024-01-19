export interface ReportService {

    getEmployeePerfomanceReport(fromDate?: string, toDate?: string, landId?: number): Promise<any>;
    generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number, landId: number): Promise<any>;
    generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date, landId: number): Promise<any>;
    generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any>;
    getCostBreakdownLineReport(fromDate?: string, landId?: number): Promise<any>;
    getCostBreakdownPieReport(): Promise<any>;

    getSummaryReport(landId?: number, cateNum?: number, fromDate?: string): Promise<any>;   
    getWeeklySummaryReport(landId?: number, fromDate?: string, toDate?: string): Promise<any>;
    getDailySummaryReport(landId?: number, fromDate?: string, toDate?: string): Promise<any>;

    getSummary(landId: number, fromDate: string): Promise<any>;
    findCIR(taskExpenseForMonth: any, incomeForMonth: any): Promise<number>
    GetQuantitySummary(workAssignedEntity : any, fromDate: string): Promise<any>
    findProfit(incomeForMonth: any, taskExpenseForMonth: any): Promise<number>

    getWeekSummary(landId: number, fromDate: string, toDate: string): Promise<any>
    GetQuantitySummaryWeek(workAssignedEntity: any, fromDate: string, toDate: string): Promise<any>

    GetDailySummary(landId: number, fromDate: string, toDate: string): Promise<any>
    GetQuantitySummaryDay(workAssignedEntity: any, fromDate: string, toDate: string): Promise<any>
  }
  