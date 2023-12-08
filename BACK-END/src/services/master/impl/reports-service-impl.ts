import { ReportDao } from '../../../dao/report-dao';
import { ReportService } from '../reports-service';
import { getConnection, getRepository } from 'typeorm';
import { WorkAssignedEntity } from '../../../entity/master/work-assigned-entity';
import { TaskTypeEntity } from '../../../entity/master/task-type-entity';
import { CropEntity } from '../../../entity/master/crop-entity';
import { IncomeEntity } from '../../../entity/master/income-entity';
import { TaskExpenseEntity } from '../../../entity/master/task-expense-entity';
import { TaskCardEntity } from "../../../entity/master/task-card-entity";
import { WorkerEntity } from "../../../entity/master/worker-entity";
import { TaskAssignedEntity } from '../../../entity/master/task-assigned-entity';
import { ExpensesEntity } from "../../../entity/master/expense-entity";
import { LandEntity } from "../../../entity/master/land-entity";
import { Units } from "../../../enum/units";
import { Status } from '../../../enum/Status';
import { TaskStatus } from '../../../enum/taskStatus';
import { Schedule } from '../../../enum/schedule';



export class ReportServiceImpl implements ReportService {


  private reportDao: ReportDao;

  constructor(reportDao: ReportDao) {
    this.reportDao = reportDao;
  }
    

  //employee-attendance report
  async generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number, landId: number): Promise<any[]> {
    return this.reportDao.generateEmployeeAttendanceReport(startDate, endDate, lotId, landId);
  }
  
  //monthly-crop report
  async generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date): Promise<any[]> {
    return this.reportDao.generateMonthlyCropReport(lotId, startDate, endDate);
  }

  //other-cost-yield report
  async generateOtherCostYieldReport(startDate: Date, endDate: Date, landId: number): Promise<any[]> {
    return this.reportDao.generateOtherCostYieldReport(startDate, endDate, landId);
  }


  //employee prefomnce report
  async getEmployeePerfomanceReport(fromDate?: string, toDate?: string, landId?: number): Promise<any> {
    return this.reportDao.getEmployeePerfomanceReport(fromDate, toDate, landId);
  }
  //Cost Breakdown Line Report
  async getCostBreakdownLineReport(fromDate?: string, landId?: number): Promise<any> {
    return this.reportDao.getCostBreakdownLineReport(fromDate, landId);

  }

  //Cost Breakdown Pi eReport
  async getCostBreakdownPieReport(): Promise<any> {
    return this.reportDao.getCostBreakdownPieReport()
  }


  //Summary Report
  async getSummaryReport(landId?: number, cateNum?: number): Promise<any> {
    return this.reportDao.getSummaryReport(landId, cateNum);
  }

}


