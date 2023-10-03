import { getConnection, Like } from "typeorm";
import { WorkerDto } from "../../dto/master/worker-dto";
import { Status } from "../../enum/status";
import { WorkerEntity } from "../../entity/master/worker-entity";
import { WorkerDao } from "../worker-dao";
import { WorkerStatus } from "../../enum/workerStatus";

/**
 * worker data access layer
 * contain crud method
 */
export class WorkerDaoImpl implements WorkerDao {
  async save(workerDto: WorkerDto): Promise<WorkerEntity> {
    let workerRepo = getConnection().getRepository(WorkerEntity);
    let workerModel = new WorkerEntity();

    workerModel.status = Status.Online;
    this.prepareWorkerModel(workerModel, workerDto);
    let savedWorker = await workerRepo.save(workerModel);
    return savedWorker;
  }
  async update(workerDto: WorkerDto): Promise<WorkerEntity> {
    let workerRepo = getConnection().getRepository(WorkerEntity);
    let workerModel = await workerRepo.findOne(workerDto.getworkerId());
    if (workerModel) {
      this.prepareWorkerModel(workerModel, workerDto);
      let updatedModel = await workerRepo.save(workerModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(workerDto: WorkerDto): Promise<WorkerEntity> {
    let workerRepo = getConnection().getRepository(WorkerEntity);
    let workerModel = await workerRepo.findOne(workerDto.getworkerId());
    if (workerModel) {
      workerModel.status = Status.Offline;
      let updatedModel = await workerRepo.save(workerModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(workerDto: WorkerDto): Promise<WorkerEntity[]> {
    let workerRepo = getConnection().getRepository(WorkerEntity);
    let searchObject: any = this.prepareSearchObject(workerDto);
    let workerModel = await workerRepo.find({
      where: searchObject,
      skip: workerDto.getStartIndex(),
      take: workerDto.getMaxResult(),
      order:{workerId:"DESC"}
    });
    return workerModel;
  }
  async findCount(workerDto: WorkerDto): Promise<number> {
    let workerRepo = getConnection().getRepository(WorkerEntity);
    let searchObject: any = this.prepareSearchObject(workerDto);
    let workerModel = await workerRepo.count({ where: searchObject });
    return workerModel;
  }
  async findById(workerId: number): Promise<WorkerEntity> {
    let workerRepo = getConnection().getRepository(WorkerEntity);
    let workerModel = await workerRepo.findOne(workerId);
    return workerModel;
  }

  async findByName(name: String): Promise<WorkerEntity> {
    let workerRepo = getConnection().getRepository(WorkerEntity);
    let workerModel = await workerRepo.findOne({ where: { name: name, status: Status.Online } });
    return workerModel;
  }
  async prepareWorkerModel(workerModel: WorkerEntity, workerDto: WorkerDto) {
    workerModel.name = workerDto.getName();
    workerModel.dob = workerDto.getDob();
    workerModel.nic = workerDto.getNic();
    workerModel.gender = workerDto.getGender();
    workerModel.joinedDate = workerDto.getJoinedDate();
    workerModel.phone = workerDto.getPhone();
    workerModel.address = workerDto.getAddress();
    workerModel.workerStatus = workerDto.getWorkerStatus();
    workerModel.createdDate = workerDto.getcreatedDate();
    workerModel.updatedDate = workerDto.getUpdatedDate();
    workerModel.status = workerDto.getStatus();
    workerModel.landId = workerDto.getLandId();
  }
  prepareSearchObject(workerDto: WorkerDto): any {
    let searchObject: any = {};
    if (workerDto.getName()) {
      searchObject.name = Like("%" + workerDto.getName() + "%");
    }
    if (workerDto.getDob()) {
      searchObject.dob = Like("%" + workerDto.getDob() + "%");
    }
    if (workerDto.getNic()) {
        searchObject.nic = Like("%" + workerDto.getNic() + "%");
    }
    if (workerDto.getGender()) {
        searchObject.gender = Like("%" + workerDto.getGender() + "%");
    }
    if (workerDto.getJoinedDate()) {
        searchObject.joinedDate = Like("%" + workerDto.getJoinedDate() + "%");
    }
    if (workerDto.getPhone()) {
        searchObject.phone = Like("%" + workerDto.getPhone() + "%");
    }
    if (workerDto.getAddress()) {
        searchObject.address = Like("%" + workerDto.getAddress() + "%");
    }
    searchObject.workerStatus = WorkerStatus.Active;
    if (workerDto.getcreatedDate()) {
        searchObject.createdDate = Like("%" + workerDto.getcreatedDate() + "%");
    }
    if (workerDto.getUpdatedDate()) {
        searchObject.updatedDate = Like("%" + workerDto.getUpdatedDate() + "%");
    }
    searchObject.status = Status.Online;
    if (workerDto.getLandId()) {
        searchObject.landId = Like("%" + workerDto.getLandId() + "%");
      }
    return searchObject;
  }
}