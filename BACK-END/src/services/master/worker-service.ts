import { CommonResponse } from "../../common/dto/common-response";
import { WorkerDto } from "../../dto/master/worker-dto";

export interface WorkerService {
  save(workerDto: WorkerDto): Promise<CommonResponse>;
  update(workerDto: WorkerDto): Promise<CommonResponse>;
  delete(workerDto: WorkerDto): Promise<CommonResponse>;
  find(workerDto: WorkerDto): Promise<CommonResponse>;
  findById(workerId: number): Promise<CommonResponse>;
  findByLandId(landId: number): Promise<CommonResponse>;
  getWorkerByLandId(workerDto: WorkerDto): Promise<CommonResponse>;
}
