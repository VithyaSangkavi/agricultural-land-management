import { getConnection, Like } from "typeorm";
import { TaskDto } from "../../dto/master/task-dto";
import { Status } from "../../enum/status";
import { TaskEntity } from "../../entity/master/task-entity";
import { WorkerStatus } from "../../enum/workerStatus";
import { TaskDao } from "../task-dao";

/**
 * task data access layer
 * contain crud method
 */
export class TaskDaoImpl implements TaskDao {
  async save(taskDto: TaskDto): Promise<TaskEntity> {
    let taskRepo = getConnection().getRepository(TaskEntity);
    let taskModel = new TaskEntity();

    taskModel.status = Status.Online;
    this.prepareTaskModel(taskModel, taskDto);
    let savedTask = await taskRepo.save(taskModel);
    return savedTask;
  }
  async update(taskDto: TaskDto): Promise<TaskEntity> {
    let taskRepo = getConnection().getRepository(TaskEntity);
    let taskModel = await taskRepo.findOne(taskDto.getTaskId());
    if (taskModel) {
      this.prepareTaskModel(taskModel, taskDto);
      let updatedModel = await taskRepo.save(taskModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(taskDto: TaskDto): Promise<TaskEntity> {
    let taskRepo = getConnection().getRepository(TaskEntity);
    let taskModel = await taskRepo.findOne(taskDto.getTaskId());
    if (taskModel) {
      taskModel.status = Status.Offline;
      let updatedModel = await taskRepo.save(taskModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(taskDto: TaskDto): Promise<TaskEntity[]> {
    let taskRepo = getConnection().getRepository(TaskEntity);
    let searchObject: any = this.prepareSearchObject(taskDto);
    let taskModel = await taskRepo.find({
      where: searchObject,
      skip: taskDto.getStartIndex(),
      take: taskDto.getMaxResult(),
      order:{taskId:"DESC"}
    });
    return taskModel;
  }
  async findCount(taskDto: TaskDto): Promise<number> {
    let taskRepo = getConnection().getRepository(TaskEntity);
    let searchObject: any = this.prepareSearchObject(taskDto);
    let taskModel = await taskRepo.count({ where: searchObject });
    return taskModel;
  }
  async findById(taskId: number): Promise<TaskEntity> {
    let taskRepo = getConnection().getRepository(TaskEntity);
    let taskModel = await taskRepo.findOne(taskId);
    return taskModel;
  }

  async findByName(taskName: String): Promise<TaskEntity> {
    let taskRepo = getConnection().getRepository(TaskEntity);
    let taskModel = await taskRepo.findOne({ where: { taskName: taskName, status: Status.Online } });
    return taskModel;
  }
  async prepareTaskModel(taskModel: TaskEntity, taskDto: TaskDto) {
    taskModel.taskName = taskDto.getTaskName();
    taskModel.createdDate = taskDto.getcreatedDate();
    taskModel.updatedDate = taskDto.getUpdatedDate();
    taskModel.status = taskDto.getStatus();
    taskModel.cropId = taskDto.getCropId();
  }
  prepareSearchObject(taskDto: TaskDto): any {
    let searchObject: any = {};
    if (taskDto.getTaskName()) {
      searchObject.taskName = Like("%" + taskDto.getTaskName() + "%");
    }
    searchObject.workerStatus = WorkerStatus.Active;
    if (taskDto.getcreatedDate()) {
        searchObject.createdDate = Like("%" + taskDto.getcreatedDate() + "%");
    }
    if (taskDto.getUpdatedDate()) {
        searchObject.updatedDate = Like("%" + taskDto.getUpdatedDate() + "%");
    }
    searchObject.status = Status.Online;
    if (taskDto.getCropId()) {
        searchObject.cropId = Like("%" + taskDto.getCropId() + "%");
      }
    return searchObject;
  }
}
