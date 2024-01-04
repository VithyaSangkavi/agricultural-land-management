import { ConnectToDatabase } from "../../configuration/database-configuration";
<<<<<<< HEAD

jest.setTimeout(9000000);

// connect to test database
beforeAll(async () => {
    await ConnectToDatabase();
});

describe("Report Service Test ", () => {

    test("check monthly crop report", async () => {});
});
  
=======
import { findCIR } from "../../services/master/impl/reports-service-impl";

jest.setTimeout(9000000);



describe("Summary Service Test ", () => {

    test("find CIR", async () => {
        const expectedValue = 0.03;
        const taskExpenseForMonth = { monthYear: 'December 2023', totalExpense: '2500' };
        const incomeForMonth = { monthYear: 'December 2023', totalIncome: 90000 };

        const CIR = findCIR(taskExpenseForMonth, incomeForMonth);
        expect(CIR).toEqual(expectedValue);
    });
  });
>>>>>>> e90e9dd4a00fe98cf8b93d1eb66ab670da690601
