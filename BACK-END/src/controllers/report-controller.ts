import { Request, Response } from 'express';
import { ReportService } from '../services/master/reports-service'; 
import { ReportServiceImpl } from '../services/master/impl/reports-service-impl'; 
import { ReportDaoImpl } from '../dao/impl/report-dao-impl';

const reportDaoInstance = new ReportDaoImpl(); 

const reportServiceImpl: ReportService = new ReportServiceImpl(reportDaoInstance); 

//employee-attendance report
export const getEmployeeAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, lotId } = req.query;

    const employeeAttendanceReport = await reportServiceImpl.generateEmployeeAttendanceReport(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      lotId ? parseInt(lotId as string, 10) : undefined,
    );

    const formattedReport = employeeAttendanceReport.map((report) => {
      return {
        date: report.date.toISOString().split('T')[0],
        numberOfWorkers: report.numberOfWorkers,
      };
    });

    res.json(formattedReport);
  }catch (error) {
    console.error('Error in fetching employee attendance:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee attendance report' });
  }
  
};

//monthly-crop report
export const getMonthlyCropReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lotId, startDate, endDate } = req.query;

    const monthlyCropReport = await reportServiceImpl.generateMonthlyCropReport(
      lotId ? parseInt(lotId as string, 10) : undefined,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
    );

    res.json(monthlyCropReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate monthly crop report' });
  }
};

//other-cost-yield report
export const getOtherCostYieldReport = async (req: Request, res: Response): Promise<void> => {
  try {
  
    const { startDate, endDate } = req.query;

    const otherCostYieldReport = await reportServiceImpl.generateOtherCostYieldReport(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
  );
    res.json(otherCostYieldReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Other Cost / Yield report' });
  }
};


export const getEmployeePerfomanceReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeePerfomanceReport = await reportServiceImpl.getEmployeePerfomanceReport();

    res.json(employeePerfomanceReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate employee perfomanceReport report' });
  }
};

export const getCostBreakdownLineReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const costBreakdownLineReport = await reportServiceImpl.getCostBreakdownLineReport();

    res.json(costBreakdownLineReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate cost breakdown line Report report' });
  }
};

export const getgetCostBreakdownPieReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const costBreakdownPieReport = await reportServiceImpl.getCostBreakdownPieReport();

    res.json(costBreakdownPieReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate cost breakdown pie chart Report report' });
  }
}

export const getSummaryReport = async (req: Request, res: Response): Promise<void> => {
  const landId = req.params.landId;

  try {
    const costSummaryReport = await reportServiceImpl.getSummaryReport(landId);
    res.json(costSummaryReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate cost Summary Report report' });
  }
};

// export const getSummaryReport = async (req: Request, res: Response): Promise<void> => {
//   const landId = req.params.landId;

//   try {
//     const costSummaryReport = await reportServiceImpl.getSummaryReport();
//     res.json(costSummaryReport);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to generate cost Summary Report report' });
//   }
// };

