import { WorkerDto } from "../dto/master/worker-dto";
import { WorkerEntity } from "../entity/master/worker-entity";

export interface WorkerDao {
  save(workerDto: WorkerDto): Promise<WorkerEntity>;
  update(workerDto: WorkerDto): Promise<WorkerEntity>;
  delete(workerDto: WorkerDto): Promise<WorkerEntity>;
  findAll(workerDto: WorkerDto): Promise<WorkerEntity[]>;
  findById(workerId: number): Promise<WorkerEntity>;
  findByName(name: String): Promise<WorkerEntity>;
  findCount(workerDto: WorkerDto): Promise<number> ;
}