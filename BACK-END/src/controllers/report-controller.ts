import { Request, Response } from 'express';
import { ReportServiceImpl } from '../services/master/impl/reports-service-impl';

const reportServiceImpl = new ReportServiceImpl();

export const getEmployeeAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const lotId = req.query.lotId as string | undefined;

    const employeeAttendanceReport = await reportServiceImpl.generateEmployeeAttendanceReport(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      lotId ? parseInt(lotId, 10) : undefined 
    );

    const formattedReport = employeeAttendanceReport.map((report) => {
      return {
        date: report.date.toISOString().split('T')[0],
        numberOfWorkers: report.numberOfWorkers,
      };
    });

    res.json(formattedReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee attendance report' });
  }
};


export const getMonthlyCropReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lotId, startDate, endDate } = req.query;

    const monthlyCropReport = await reportServiceImpl.generateMonthlyCropReport(
      lotId ? parseInt(lotId as string, 10) : undefined,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    
    res.json(monthlyCropReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate monthly crop report' });
  }
};


export const getOtherCostYieldReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const otherCostYieldReport = await reportServiceImpl.generateOtherCostYieldReport();
    res.json(otherCostYieldReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Other Cost / Yield report' });
  }
};