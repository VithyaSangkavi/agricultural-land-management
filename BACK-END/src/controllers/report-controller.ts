import { Request, Response } from 'express';
import { ReportServiceImpl } from '../services/master/impl/reports-service-impl';

const reportServiceImpl = new ReportServiceImpl();

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

// export const getEmployeePerfomanceReport = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const employeePerfomanceReport = await reportServiceImpl.getEmployeePerfomanceReport();

//     res.json(employeePerfomanceReport);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to generate employee perfomanceReport report' });
//   }
// };

export const getEmployeePerfomanceReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fromDate, toDate } = req.query;
    console.log("Date Controller : ",fromDate, toDate);
    const employeePerfomanceReport = await reportServiceImpl.getEmployeePerfomanceReport(fromDate, toDate);

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