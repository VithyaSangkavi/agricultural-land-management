import { ConnectToDatabase } from "../../configuration/database-configuration";

jest.setTimeout(9000000);

// connect to test database
beforeAll(async () => {
    await ConnectToDatabase();
});

describe("Report Service Test ", () => {

    test("check monthly crop report", async () => {});
});
  