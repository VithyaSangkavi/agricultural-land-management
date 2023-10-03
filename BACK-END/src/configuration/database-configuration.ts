import { Db, getConnection, getConnectionManager } from "typeorm";
import { EnvironmentConfiguration } from "./environment-configuration";
import { CropEntity } from "../entity/master/Crop";
import { ExpensesEntity } from "../entity/master/Expenses";
import { IncomeEntity } from "../entity/master/Income";
import { LandEntity } from "../entity/master/Land";
import { LotEntity } from "../entity/master/Lot";
import { PaymentEntity } from "../entity/master/payment";
import { TaskEntity } from "../entity/master/task-entity";
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
  synchronize: false,
  entities: [CropEntity, ExpensesEntity, IncomeEntity, LandEntity, LotEntity, PaymentEntity, TaskEntity, TaskExpenseEntity, WorkAssignedEntity, WorkerEntity],
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
