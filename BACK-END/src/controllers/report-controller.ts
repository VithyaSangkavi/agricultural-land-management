import { Request, Response } from 'express';
import { ReportServiceImpl } from '../services/master/impl/reports-service-impl';
import { ReportDaoImpl } from '../dao/impl/report-dao-impl';
import { ReportService } from '../services/master/reports-service';

const reportDaoInstance = new ReportDaoImpl(); 

const reportServiceImpl: ReportService = new ReportServiceImpl(reportDaoInstance); 

export const getEmployeeAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeAttendanceReport = await reportServiceImpl.generateEmployeeAttendanceReport();

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
    const monthlyCropReport = await reportServiceImpl.generateMonthlyCropReport();

    // Process the monthlyCropReport if needed...

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

export const getEmployeePerfomanceReport = async (req: Request, res: Response): Promise<void> => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;

  try {
    const employeePerfomanceReport = await reportServiceImpl.getEmployeePerfomanceReport(fromDate, toDate);

    res.json(employeePerfomanceReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate employee perfomanceReport report' });
  }
};

export const getCostBreakdownLineReport = async (req: Request, res: Response): Promise<void> => {
  const landId = req.query.landId;
  console.log("Back-end ctr land: ", landId);
  try {
    const costBreakdownLineReport = await reportServiceImpl.getCostBreakdownLineReport(landId);

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

// export const getgetCostBreakdownPieReport = async (req: Request, res: Response): Promise<void> => {
//   const landId = req.params.landId;

//   try {
//     const costBreakdownPieReport = await reportServiceImpl.getCostBreakdownPieReport(landId);

//     res.json(costBreakdownPieReport);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to generate cost breakdown pie chart Report report' });
//   }
// }

export const getSummaryReport = async (req: Request, res: Response): Promise<void> => {
  const landId = req.params.landId;

  try {
    const costSummaryReport = await reportServiceImpl.getSummaryReport(landId);
    res.json(costSummaryReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate cost Summary Report report' });
  }
};