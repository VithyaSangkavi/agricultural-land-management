export interface ReportService {

    getEmployeePerfomanceReport(fromDate?: string, toDate?: string, landId?: number): Promise<any>;
    generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number, landId: number): Promise<any>;
    generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date, landId: number): Promise<any>;
    generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number, lotId: number): Promise<any>;
    getCostBreakdownLineReport(fromDate?: string, landId?: number): Promise<any>;
    getCostBreakdownPieReport(): Promise<any>;

    getSummaryReport(landId?: number, cateNum?: number): Promise<any>;   
    getWeeklySummaryReport(landId?: number): Promise<any>;
    getDailySummaryReport(landId?: number): Promise<any>;

    getSummary(landId: number): Promise<any>;
    findCIR(taskExpenseForMonth: any, incomeForMonth: any): Promise<number>
    GetQuantitySummary(workAssignedEntity : any, TaskExpenseEntity: any[]): Promise<any>
    findProfit(incomeForMonth: any, taskExpenseForMonth: any): Promise<number>

    getWeekSummary(landId: number): Promise<any>
    GetQuantitySummaryWeek(workAssignedEntity: any): Promise<any>

    GetDailySummary(landId: number): Promise<any>
    GetQuantitySummaryDay(workAssignedEntity: any): Promise<any>
  }
  