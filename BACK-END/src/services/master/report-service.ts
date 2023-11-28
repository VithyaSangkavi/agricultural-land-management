import { CommonResponse } from "../../common/dto/common-response";
import { ExpensesDto } from "../../dto/master/expenses-dto";
import { WorkerDto } from "../../dto/master/worker-dto";

export interface ReportService {
//   save(workerDto: WorkerDto): Promise<CommonResponse>;
//   update(workerDto: WorkerDto): Promise<CommonResponse>;
//   delete(workerDto: WorkerDto): Promise<CommonResponse>;
  findExpenses(expenseDto: ExpensesDto): Promise<CommonResponse>;
//   findById(workerId: number): Promise<CommonResponse>;
//   findByLandId(landId: number): Promise<CommonResponse>;
}