import { ReportServiceImpl } from "../../services/master/impl/reports-service-impl";
import { ReportService } from "../../services/master/reports-service";


jest.setTimeout(9000000);

describe("Summary Service Test ", () => {

    const reportService: ReportService = new ReportServiceImpl();


    test("find CIR", async () => {
        const expectedValue = 0.03;
        const taskExpenseForMonth = { monthYear: 'December 2023', totalExpense: '2500' };
        const incomeForMonth = { monthYear: 'December 2023', totalIncome: 90000 };

        const CIR = await reportService.findCIR(taskExpenseForMonth, incomeForMonth)

        expect(CIR).toEqual(expectedValue);
    });

    test("find Profit", async () => {
        const expectedValue = 87500;
        const incomeForMonth = { monthYear: 'December 2023', totalIncome: 90000 };
        const taskExpenseForMonth = { monthYear: 'December 2023', totalExpense: '2500' };

        const Profit = await reportService.findProfit(incomeForMonth, taskExpenseForMonth)

        expect(Profit).toEqual(expectedValue);
    });


  });