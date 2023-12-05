import { ReportDao } from '../../../dao/report-dao';
import { ReportService } from '../reports-service';

export class ReportServiceImpl implements ReportService {
  private reportDao: ReportDao;

  constructor(reportDao: ReportDao) {
    this.reportDao = reportDao;
  }

  //employee-attendance report
  async generateEmployeeAttendanceReport(startDate: Date, endDate: Date, lotId: number): Promise<any[]> {
    return this.reportDao.generateEmployeeAttendanceReport(startDate, endDate, lotId);
  }

  //monthly-crop report
  async generateMonthlyCropReport(lotId: number, startDate: Date, endDate: Date): Promise<any[]> {
    return this.reportDao.generateMonthlyCropReport(lotId, startDate, endDate);
  }

  //other-cost-yield report
  async generateOtherCostYieldReport(startDate: Date, endDate: Date): Promise<any[]> {
    return this.reportDao.generateOtherCostYieldReport(startDate, endDate);
  }
}
