import { getConnection, Like } from "typeorm";
import { WorkerDto } from "../../dto/master/worker-dto";
import { Status } from "../../enum/Status";
import { WorkerEntity } from "../../entity/master/worker-entity";
import { WorkerDao } from "../worker-dao";
import { WorkerStatus } from "../../enum/workerStatus";
import { LandEntity } from "../../entity/master/land-entity";
import { IWorker } from "../../types/woker-types";

/**
 * worker data access layer
 * contain crud method
 */
export class WorkerDaoImpl implements WorkerDao {
  async save(workerDto: WorkerDto, landModel: LandEntity): Promise<WorkerEntity> {
    let workerRepo = getConnection().getRepository(WorkerEntity);
    let workerModel = new WorkerEntity();

    workerModel.land = landModel;
    this.prepareWorkerModel(workerModel, workerDto);
    let savedWorker = await workerRepo.save(workerModel);
    return savedWorker;
  }
  async update(workerDto: WorkerDto): Promise<WorkerEntity> {
    let workerRepo = getConnection().getRepository(WorkerEntity);
    let workerModel = await workerRepo.findOne(workerDto.getWorkerId());
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
    let workerModel = await workerRepo.findOne(workerDto.getWorkerId());
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

    console.log(workerDto);
    
   
    const query = workerRepo.createQueryBuilder("worker")
      .innerJoin("worker.land", "land")
      // .where("land.id = :landId", { landId: workerDto.getLandId() })
      .where("worker.status = :worker_status", {worker_status: Status.Online })
      .orderBy("worker.name", "ASC");

    const landWorkers = await query.getMany();

    return landWorkers;
  }

  // async findAll(workerDto: WorkerDto): Promise<WorkerEntity[]> {
  //   let workerRepo = getConnection().getRepository(WorkerEntity);
   
  //   const query = workerRepo.createQueryBuilder("worker")
  //     .innerJoin("worker.land", "land")
  //     .where("land.id = :landId", { landId: workerDto.getLandId() })
  //     .andWhere("worker.status = :worker_status", {worker_status: Status.Online })
  //     .orderBy("worker.name", "ASC")
  //     .select(["woker.id as workerID", "worker.name as wokerName"]);

  //   // const landWorkers = await query.getMany();
  //   const landWorkers = await query.getRawMany();

  //   const result = landWorkers.map((i) => {
  //     const woker: IWorker = {
  //       id: i.workerID,
  //       name: i.wokerName
  //     } 
  //     return woker;
  //   });

  //   return result;
  // }
  
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

  async findByLandId(landId: number): Promise<WorkerEntity[]> {
    let workerRepo = getConnection().getRepository(WorkerEntity);
    const workers = await workerRepo.find({
      where: {
        land: { id: landId }, 
        workerStatus: WorkerStatus.Active,
        status: Status.Online,
      },
    });
    return workers;
  }  

  async findWorkerIdByName(name: string): Promise<number | null> {
    try {
      const workerRepo = getConnection().getRepository(LandEntity);
      const workerModel = await workerRepo.findOne({
        where: { name, status: Status.Online }, 
        select: ['id'], 
      });
  
      return workerModel ? workerModel.id : null;
    } catch (error) {
      console.error('Error finding worker ID:', error);
      return null;
    }
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
    workerModel.createdDate = new Date();
    workerModel.updatedDate = new Date();
    workerModel.status = Status.Online;
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
