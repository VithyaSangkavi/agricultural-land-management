import { ConnectToDatabase } from "../../configuration/database-configuration";
import { findCIR, findProfit } from "../../services/master/impl/reports-service-impl";

jest.setTimeout(9000000);



describe("Summary Service Test ", () => {

    test("find CIR", async () => {
        const expectedValue = 0.03;
        const taskExpenseForMonth = { monthYear: 'December 2023', totalExpense: '2500' };
        const incomeForMonth = { monthYear: 'December 2023', totalIncome: 90000 };

        const CIR = findCIR(taskExpenseForMonth, incomeForMonth);
        expect(CIR).toEqual(expectedValue);
    });

    test("find profit", async () => {
        const expectedValue = 87500;
        const incomeForMonth = { monthYear: 'December 2023', totalIncome: 90000 };
        const taskExpenseForMonth = { monthYear: 'December 2023', totalExpense: '2500' };

        const profit = findProfit(incomeForMonth, taskExpenseForMonth);
        expect(profit).toEqual(expectedValue);
    });
  });
