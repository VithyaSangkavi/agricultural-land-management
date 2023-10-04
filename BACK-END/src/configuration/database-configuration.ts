import { Db, getConnection, getConnectionManager } from "typeorm";
import { EnvironmentConfiguration } from "./environment-configuration";
import { CropEntity } from "../entity/master/crop-entity";
import { ExpensesEntity } from "../entity/master/expense-entity";
import { IncomeEntity } from "../entity/master/income-entity";
import { LandEntity } from "../entity/master/land-entity";
import { LotEntity } from "../entity/master/lot-entity";
import { PaymentEntity } from "../entity/master/payment-entity";
import { TaskTypeEntity } from "../entity/master/task-type-entity";
import { TaskExpenseEntity } from "../entity/master/task-expense-entity";
import { WorkAssignedEntity } from "../entity/master/work-assigned-entity";
import { WorkerEntity } from "../entity/master/worker-entity";

const connectionManager = getConnectionManager();
const environmentConfiguration = new EnvironmentConfiguration();
const appConfig = environmentConfiguration.readAppConfiguration();

const Connection = connectionManager.create({
  type: "mysql",
  host: appConfig.getHost(),
  port: appConfig.getDataBasePort(),
  username: appConfig.getUserName(),
  password: appConfig.getPassword(),
  database: appConfig.getDataBase(),
  synchronize: true,
  entities: [CropEntity, ExpensesEntity, IncomeEntity, LandEntity, LotEntity, PaymentEntity, TaskTypeEntity, TaskExpenseEntity, WorkAssignedEntity, WorkerEntity],
  logging: false,
});

export const ConnectToDatabase = async () => {
  try {
    const connection = await Connection.connect();
    console.log("Database connected !");
    // new MasterDataCopy().copyData();
    // new MasterDataCopy().copyAisleToFieldMasterData();
  } catch (error) {
    console.log(error);
    console.log("Database connection Failed !");
  }
};
