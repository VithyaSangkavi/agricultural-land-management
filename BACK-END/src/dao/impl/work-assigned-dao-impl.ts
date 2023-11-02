import { getConnection, Like } from "typeorm";
import { WorkAssignedDto } from "../../dto/master/work-assigned-dto";
import { Status } from "../../enum/Status";
import { WorkAssignedEntity } from "../../entity/master/work-assigned-entity";
import { WorkerStatus } from "../../enum/workerStatus";
import { WorkAssignedDao } from "../work-assigned-dao";
import { TaskStatus } from "../../enum/taskStatus";
import { WorkerEntity } from "../../entity/master/worker-entity";
import { TaskTypeEntity } from "../../entity/master/task-type-entity";
import { LotEntity } from "../../entity/master/lot-entity";
import { TaskAssignedEntity } from "../../entity/master/task-assigned-entity";
import { IWorkerAssignedInfoFromDao } from "../../types/worker-assignedt-types";
import { log } from "util";

/**
 * work-assigned data access layer
 * contain crud method
 */
export class WorkAssignedDaoImpl implements WorkAssignedDao {
  async save(workAssignedDto: WorkAssignedDto, workerModel: WorkerEntity, taskTypeModel: TaskTypeEntity, lotModel: LotEntity, taskAssignedModel: TaskAssignedEntity): Promise<WorkAssignedEntity> {
    let workAssignedRepo = getConnection().getRepository(WorkAssignedEntity);
    let workAssignedModel = new WorkAssignedEntity();

    workAssignedModel.worker = workerModel;
    workAssignedModel.task = taskTypeModel;
    workAssignedModel.lot = lotModel;
    workAssignedModel.taskAssigned = taskAssignedModel;
    this.prepareWorkAssignedModel(workAssignedModel, workAssignedDto);
    let savedWorkAssigned = await workAssignedRepo.save(workAssignedModel);
    return savedWorkAssigned;
  }
  async update(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity> {
    let workAssignedRepo = getConnection().getRepository(WorkAssignedEntity);
    let workAssignedModel = await workAssignedRepo.findOne(workAssignedDto.getAttendanceid());
    if (workAssignedModel) {
      this.prepareWorkAssignedModel(workAssignedModel, workAssignedDto);
      let updatedModel = await workAssignedRepo.save(workAssignedModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(workAssignedDto: WorkAssignedDto): Promise<WorkAssignedEntity> {
    let workAssignedRepo = getConnection().getRepository(WorkAssignedEntity);
    let workAssignedModel = await workAssignedRepo.findOne(workAssignedDto.getAttendanceid());
    if (workAssignedModel) {
      workAssignedModel.status = Status.Offline;
      let updatedModel = await workAssignedRepo.save(workAssignedModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(landId: number): Promise<IWorkerAssignedInfoFromDao[]> {
    let workAssignedRepo = getConnection().getRepository(WorkAssignedEntity);

    const query = workAssignedRepo
      .createQueryBuilder("workerAssiged")
      .innerJoin("workerAssiged.lot", "lot")
      .innerJoin("lot.land", "land")
      .where("land.id = :landID", { landID: landId });

      query.select(["land.id as landID", "land.name as landName"]);

    const result = await query.getRawMany();
    //const result = await query.getMany();

    const workerAssigedInfo: IWorkerAssignedInfoFromDao[] = result.map((i) => {
      return {
        landID: i.landID,
        landName: i.landName
      }
    });

    console.log(workerAssigedInfo);
    

    return workerAssigedInfo;
    

    // const result = await query.getMany();

    console.log(query.getSql());
    

    return result;
    
    // let workAssignedModel = await workAssignedRepo.find({
    //   where: {lot:{land:{id: landId}}},
    //   relations: [
    //     "lot", "land"
    //   ]});
    // return workAssignedModel;
  }
  async findCount(landId: number): Promise<number> {
    let workAssignedRepo = getConnection().getRepository(WorkAssignedEntity);
    let workAssignedModel = await workAssignedRepo.count({ where: { lot: { land: { id: landId } } } });
    return workAssignedModel;
  }
  async findById(workerId: number): Promise<WorkAssignedEntity> {
    let workAssignedRepo = getConnection().getRepository(WorkAssignedEntity);
    let workAssignedModel = await workAssignedRepo.findOne(workerId);
    return workAssignedModel;
  }

  async findByName(name: String): Promise<WorkAssignedEntity> {
    let workAssignedRepo = getConnection().getRepository(WorkAssignedEntity);
    let workAssignedModel = await workAssignedRepo.findOne({ where: { name: name, status: Status.Online } });
    return workAssignedModel;
  }
  // async findByTaskAssignedId(taskAssignedId: number): Promise<WorkAssignedEntity[]> {
  //   const workAssignedRepo = getConnection().getRepository(WorkAssignedEntity);
  //   let workAssignedModel = await workAssignedRepo.find({ where: { taskAssigned: taskAssignedId } });
  //   return workAssignedModel;
  // }
  async prepareWorkAssignedModel(workAssignedModel: WorkAssignedEntity, workAssignedDto: WorkAssignedDto) {
    workAssignedModel.quantity = workAssignedDto.getQuantity();
    workAssignedModel.units = workAssignedDto.getUnits();
    workAssignedModel.startDate = workAssignedDto.getStartDate();
    workAssignedModel.endDate = workAssignedDto.getEndDate();
    workAssignedModel.createdDate = new Date();
    workAssignedModel.updatedDate = new Date();
    workAssignedModel.status = Status.Online;
    workAssignedModel.taskStatus = workAssignedDto.getTaskStatus();
  }
  prepareSearchObject(workAssignedDto: WorkAssignedDto): any {
    let searchObject: any = {};
    if (workAssignedDto.getQuantity()) {
      searchObject.quantity = Like("%" + workAssignedDto.getQuantity() + "%");
    }
    if (workAssignedDto.getUnits()) {
      searchObject.units = Like("%" + workAssignedDto.getUnits() + "%");
    }
    if (workAssignedDto.getStartDate()) {
        searchObject.startDate = Like("%" + workAssignedDto.getStartDate() + "%");
    }
    if (workAssignedDto.getEndDate()) {
        searchObject.endDate = Like("%" + workAssignedDto.getEndDate() + "%");
    }
    if (workAssignedDto.getcreatedDate()) {
        searchObject.createdDate = Like("%" + workAssignedDto.getcreatedDate() + "%");
    }
    if (workAssignedDto.getUpdatedDate()) {
        searchObject.updatedDate = Like("%" + workAssignedDto.getUpdatedDate() + "%");
    }

    searchObject.status = Status.Online;
    
    searchObject.taskStatus = TaskStatus.Completed;

    if (workAssignedDto.getworkerId()) {
        searchObject.workerId = Like("%" + workAssignedDto.getworkerId() + "%");
    }
    if (workAssignedDto.getTaskId()) {
        searchObject.taskId = Like("%" + workAssignedDto.getTaskId() + "%");
    }
    if (workAssignedDto.getLotId()) {
        searchObject.lotId = Like("%" + workAssignedDto.getLotId() + "%");
    }
    return searchObject;
  }
}
