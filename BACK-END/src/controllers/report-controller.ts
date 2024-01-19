import { Request, Response } from 'express';
import { ReportServiceImpl } from '../services/master/impl/reports-service-impl';
import { ReportService } from '../services/master/reports-service';

const reportServiceImpl: ReportService = new ReportServiceImpl();

//employee-attendance report
export const getEmployeeAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, lotId, landId } = req.query;

    const employeeAttendanceReport = await reportServiceImpl.generateEmployeeAttendanceReport(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      lotId ? parseInt(lotId as string, 10) : undefined,
      landId ? parseInt(landId as string, 10) : undefined,
    );

    const formattedReport = employeeAttendanceReport.map((report) => {
      return {
        date: report.date.toISOString().split('T')[0],
        numberOfWorkers: report.numberOfWorkers,
      };
    });

    res.json(formattedReport);
  } catch (error) {
    console.error('Error in fetching employee attendance:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee attendance report' });
  }

};

//monthly-crop report
export const getMonthlyCropReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lotId, startDate, endDate, landId } = req.query;

    const monthlyCropReport = await reportServiceImpl.generateMonthlyCropReport(
      lotId ? parseInt(lotId as string, 10) : undefined,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      landId ? parseInt(landId as string, 10) : undefined,
    );

    res.json(monthlyCropReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate monthly crop report' });
  }
};

//other-cost-yield report
export const getOtherCostYieldReport = async (req: Request, res: Response): Promise<void> => {
  try {

  
    const { startDate, endDate, landId, lotId } = req.query;

    const otherCostYieldReport = await reportServiceImpl.generateOtherCostYieldReport(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,

      landId ? parseInt(landId as string, 10) : undefined,
      lotId ? parseInt(lotId as string, 10) : undefined,
  );

    res.json(otherCostYieldReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Other Cost / Yield report' });
  }
};

export const getEmployeePerfomanceReport = async (req: Request, res: Response): Promise<void> => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const landId = req.query.landId;

  try {
    const employeePerfomanceReport = await reportServiceImpl.getEmployeePerfomanceReport(fromDate, toDate, landId);

    res.json(employeePerfomanceReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate employee perfomanceReport report' });
  }
};

export const getCostBreakdownLineReport = async (req: Request, res: Response): Promise<void> => {
  const fromDate = req.query.fromDate;
  const landId = req.query.landId;
  console.log("Back-end ctr land: ", landId);
  console.log("Back-end ctr fromDate: ", fromDate);
  try {
    const costBreakdownLineReport = await reportServiceImpl.getCostBreakdownLineReport(fromDate, landId);

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
  const landId = req.query.landId;
  const cateNum = req.query.cateNum;
  const fromDate = req.query.fromDate;
  console.log("Back-end ctr land: ", landId);
  console.log("Back-end ctr cateNum: ", cateNum);
  console.log("Back-end ctr fromdate: ", fromDate);
  try {
    const costSummaryReport = await reportServiceImpl.getSummaryReport(landId, cateNum, fromDate);
    res.json(costSummaryReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate cost Summary Report report' });
  }
};

export const getWeeklySummaryReport = async (req: Request, res: Response): Promise<void> => {
  const landId = req.query.landId;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;

  console.log("Back-end ctr land: ", landId);
  console.log("Back-end ctr dateRange: ", fromDate, toDate);

  try {
    const costSummaryReport = await reportServiceImpl.getWeeklySummaryReport(landId, fromDate, toDate);
    res.json(costSummaryReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate cost Summary Report report' });
  }
};

export const getDailySummaryReport = async (req: Request, res: Response): Promise<void> => {
  const landId = req.query.landId;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;

  console.log("Back-end ctr land: ", landId);
  console.log("Back-end ctr dateRange: ", fromDate, toDate);

  try {
    const costSummaryReport = await reportServiceImpl.getDailySummaryReport(landId, fromDate, toDate);
    res.json(costSummaryReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate cost Summary Report report' });
  }
};



