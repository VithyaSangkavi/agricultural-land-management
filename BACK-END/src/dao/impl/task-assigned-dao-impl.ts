import { getConnection, Like } from "typeorm";
import { TaskAssignedDto } from "../../dto/master/task-assigned-dto";
import { Status } from "../../enum/Status";
import { TaskAssignedEntity } from "../../entity/master/task-assigned-entity";
import { WorkerStatus } from "../../enum/workerStatus";
import { TaskAssignedDao } from "../task-assigned-dao";
import { LandEntity } from "../../entity/master/land-entity";
import { TaskTypeEntity } from "../../entity/master/task-type-entity";

/**
 * task-expense data access layer
 * contain crud method
 */
export class TaskAssignedDaoImpl implements TaskAssignedDao {
  async save(taskAssignedDto: TaskAssignedDto, landModel: LandEntity, taskTypeModel: TaskTypeEntity): Promise<TaskAssignedEntity> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    let taskAssignedModel = new TaskAssignedEntity();

    taskAssignedModel.land = landModel;
    taskAssignedModel.task = taskTypeModel;
    this.preparetaskAssignedModel(taskAssignedModel, taskAssignedDto);
    let savedTask = await taskAssignedRepo.save(taskAssignedModel);
    return savedTask;
  }
  async update(taskAssignedDto: TaskAssignedDto): Promise<TaskAssignedEntity> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    let taskAssignedModel = await taskAssignedRepo.findOne(taskAssignedDto.getTaskAssignedId());
    if (taskAssignedModel) {
      this.preparetaskAssignedModel(taskAssignedModel, taskAssignedDto);
      let updatedModel = await taskAssignedRepo.save(taskAssignedModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(taskAssignedDto: TaskAssignedDto): Promise<TaskAssignedEntity> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    let taskAssignedModel = await taskAssignedRepo.findOne(taskAssignedDto.getTaskAssignedId());
    if (taskAssignedModel) {
      taskAssignedModel.status = Status.Offline;
      let updatedModel = await taskAssignedRepo.save(taskAssignedModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(taskAssignedDto: TaskAssignedDto): Promise<TaskAssignedEntity[]> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    let searchObject: any = this.prepareSearchObject(taskAssignedDto);
    let taskAssignedModel = await taskAssignedRepo.find({
      where: searchObject,
      skip: taskAssignedDto.getStartIndex(),
      take: taskAssignedDto.getMaxResult(),
      order:{id:"DESC"}
    });
    return taskAssignedModel;
  }
  async findCount(taskAssignedDto: TaskAssignedDto): Promise<number> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    let searchObject: any = this.prepareSearchObject(taskAssignedDto);
    let taskAssignedModel = await taskAssignedRepo.count({ where: searchObject });
    return taskAssignedModel;
  }
  async findById(taskId: number): Promise<TaskAssignedEntity> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    let taskAssignedModel = await taskAssignedRepo.findOne(taskId);
    return taskAssignedModel;
  }

  async findByName(status: Status): Promise<TaskAssignedEntity> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    let taskAssignedModel = await taskAssignedRepo.findOne({ where: { status: status} });
    return taskAssignedModel;
  }

  async preparetaskAssignedModel(taskAssignedModel: TaskAssignedEntity, taskAssignedDto: TaskAssignedDto) {
    taskAssignedModel.startDate = taskAssignedDto.getStartDate();
    taskAssignedModel.endDate = taskAssignedDto.getEndDate();
    taskAssignedModel.status = taskAssignedDto.getStatus();
  }
  prepareSearchObject(taskAssignedDto: TaskAssignedDto): any {
    let searchObject: any = {};

    if (taskAssignedDto.getStartDate()) {
        searchObject.createdDate = Like("%" + taskAssignedDto.getStartDate() + "%");
    }
    if (taskAssignedDto.getEndDate()) {
        searchObject.updatedDate = Like("%" + taskAssignedDto.getEndDate() + "%");
    }
    searchObject.status = Status.Online;

    if (taskAssignedDto.getLandId()) {
        searchObject.expenseId = Like("%" + taskAssignedDto.getLandId() + "%");
    }
    if (taskAssignedDto.getTaskId()) {
        searchObject.taskId = Like("%" + taskAssignedDto.getTaskId() + "%");
    }
    return searchObject;
  }
}
