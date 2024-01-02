import { getConnection, Like } from "typeorm";
import { TaskAssignedDto } from "../../dto/master/task-assigned-dto";
import { Status } from "../../enum/Status";
import { TaskStatus } from "../../enum/taskStatus";
import { TaskAssignedEntity } from "../../entity/master/task-assigned-entity";
import { WorkerStatus } from "../../enum/workerStatus";
import { TaskAssignedDao } from "../task-assigned-dao";
import { LandEntity } from "../../entity/master/land-entity";
import { TaskTypeEntity } from "../../entity/master/task-type-entity";
import { Schedule } from "../../enum/schedule";
import { CommonResponse } from "../../common/dto/common-response";
import { ErrorHandlerSup } from "../../support/error-handler-sup";

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
    taskAssignedModel.schedule = Schedule.NotScheduled;
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
      order: { id: "DESC" }
    });
    return taskAssignedModel;
  }

  async findCount(taskAssignedDto: TaskAssignedDto): Promise<number> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    let searchObject: any = this.prepareSearchObject(taskAssignedDto);
    let taskAssignedModel = await taskAssignedRepo.count({ where: searchObject });
    return taskAssignedModel;
  }
  
  async findById(taskAssignedId: number): Promise<TaskAssignedEntity> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    let taskAssignedModel = await taskAssignedRepo.findOne(taskAssignedId);
    if (!taskAssignedModel) {
      throw new Error("TaskAssignedEntity not found"); 
    }
    return taskAssignedModel;
  }
  

  async findByName(status: Status): Promise<TaskAssignedEntity> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    let taskAssignedModel = await taskAssignedRepo.findOne({ where: { status: status } });
    return taskAssignedModel;
  }

  async findByTaskId(taskId: number): Promise<TaskAssignedEntity> {
    const taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);
    console.log("Searching for taskId:", taskId);
    const taskAssignedModel = await taskAssignedRepo.findOne({
      where: { task: taskId },
    });
    console.log("Query result:", taskAssignedModel);
    return taskAssignedModel;
  }

  async updateEndDate(taskAssignedId: number, endDate: Date, newStatus: string): Promise<TaskAssignedEntity | null> {
    const incomeRepository = getConnection().getRepository(TaskAssignedEntity);

    try {
      const details = await incomeRepository.findOne(taskAssignedId);

      details.endDate = new Date();
      details.taskStatus = newStatus as TaskStatus;

      const updatedDate = await incomeRepository.save(details);

      return updatedDate;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(taskAssignedId: number, newStatus: string): Promise<TaskAssignedEntity | null> {
    const incomeRepository = getConnection().getRepository(TaskAssignedEntity);

    try {
      const existingStatus = await incomeRepository.findOne(taskAssignedId);

      if (!existingStatus) {
        return null;
      }

      // Use type casting to assign newStatus to schedule
      existingStatus.schedule = newStatus as Schedule;

      const updatedStatus = await incomeRepository.save(existingStatus);

      return updatedStatus;
    } catch (error) {
      throw error;
    }
  }

  async getOngoingTasksWithTaskNames(landId?: number): Promise<TaskAssignedEntity[]> {

    console.log("land id : ", landId)

    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);

    const queryBuilder = taskAssignedRepo
      .createQueryBuilder('taskAssigned')
      .innerJoin('taskAssigned.task', 'task')
      .innerJoin('taskAssigned.land', 'land');

    if (!Number.isNaN(landId)) {
      queryBuilder.where('land.id = :landId', { landId });
    }

    const tasks = await queryBuilder
      .andWhere('taskAssigned.taskStatus = :taskStatus', { taskStatus: TaskStatus.Ongoing })
      .andWhere('taskAssigned.status = :status', { status: Status.Online })
      .groupBy('taskAssigned.taskAssignedId')
      .select(['taskAssigned.taskAssignedId as taskAssignedId', 'MAX(task.id) as taskId', 'MAX(task.taskName) as taskName', 'taskAssigned.startDate as taskStartDate', 'taskAssigned.landId as landId'])
      .getRawMany();

    return tasks;
  }


  async getCompletedTasksWithTaskNames(landId: number): Promise<TaskAssignedEntity[]> {
    let taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);

    const tasks = await taskAssignedRepo

      .createQueryBuilder('taskAssigned')
      .innerJoin('taskAssigned.task', 'task')
      .innerJoin('taskAssigned.land', 'land')
      .where('land.id = :landId', { landId })
      .andWhere('taskAssigned.taskStatus = :taskStatus', { taskStatus: TaskStatus.Completed })
      .andWhere('taskAssigned.status = :status', { status: Status.Online })
      .groupBy('taskAssigned.taskAssignedId')
      .select(['taskAssigned.taskAssignedId as taskAssignedId', 'MAX(task.id) as taskId', 'MAX(task.taskName) as taskName', 'taskAssigned.startDate as taskStartDate', 'taskAssigned.landId as landId'])
      .getRawMany();

    return tasks;

  }


  async preparetaskAssignedModel(taskAssignedModel: TaskAssignedEntity, taskAssignedDto: TaskAssignedDto) {
    taskAssignedModel.startDate = taskAssignedDto.getStartDate();
    taskAssignedModel.endDate = taskAssignedDto.getEndDate();
    taskAssignedModel.status = taskAssignedDto.getStatus();
    taskAssignedModel.taskStatus = taskAssignedDto.getTaskStatus();
    taskAssignedModel.schedule = Schedule.NotScheduled;
  }
  prepareSearchObject(taskAssignedDto: TaskAssignedDto): any {
    let searchObject: any = {};

    if (taskAssignedDto.getStartDate()) {
      searchObject.startDate = Like("%" + taskAssignedDto.getStartDate() + "%");
    }
    if (taskAssignedDto.getEndDate()) {
      searchObject.endDate = Like("%" + taskAssignedDto.getEndDate() + "%");
    }
    searchObject.status = Status.Online;

    searchObject.taskStatus = TaskStatus.Completed;

    searchObject.schedule = Schedule.NotScheduled;

    if (taskAssignedDto.getLandId()) {
      searchObject.landId = Like("%" + taskAssignedDto.getLandId() + "%");
    }
    if (taskAssignedDto.getTaskId()) {
      searchObject.taskId = Like("%" + taskAssignedDto.getTaskId() + "%");
    }
    return searchObject;
  }
}
