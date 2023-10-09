import { getConnection, Like } from "typeorm";
import { TaskExpenseDto } from "../../dto/master/task-expense-dto";
import { Status } from "../../enum/Status";
import { TaskExpenseEntity } from "../../entity/master/task-expense-entity";
import { WorkerStatus } from "../../enum/workerStatus";
import { TaskExpenseDao } from "../task-expense-dao";

/**
 * task-expense data access layer
 * contain crud method
 */
export class TaskExpenseDaoImpl implements TaskExpenseDao {
  async save(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity> {
    let taskExpenseRepo = getConnection().getRepository(TaskExpenseEntity);
    let taskExpenseModel = new TaskExpenseEntity();

    taskExpenseModel.status = Status.Online;
    this.prepareTaskExpenseModel(taskExpenseModel, taskExpenseDto);
    let savedTask = await taskExpenseRepo.save(taskExpenseModel);
    return savedTask;
  }
  async update(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity> {
    let taskExpenseRepo = getConnection().getRepository(TaskExpenseEntity);
    let taskExpenseModel = await taskExpenseRepo.findOne(taskExpenseDto.getTaskExpenseId());
    if (taskExpenseModel) {
      this.prepareTaskExpenseModel(taskExpenseModel, taskExpenseDto);
      let updatedModel = await taskExpenseRepo.save(taskExpenseModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity> {
    let taskExpenseRepo = getConnection().getRepository(TaskExpenseEntity);
    let taskExpenseModel = await taskExpenseRepo.findOne(taskExpenseDto.getTaskExpenseId());
    if (taskExpenseModel) {
      taskExpenseModel.status = Status.Offline;
      let updatedModel = await taskExpenseRepo.save(taskExpenseModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(taskExpenseDto: TaskExpenseDto): Promise<TaskExpenseEntity[]> {
    let taskExpenseRepo = getConnection().getRepository(TaskExpenseEntity);
    let searchObject: any = this.prepareSearchObject(taskExpenseDto);
    let taskExpenseModel = await taskExpenseRepo.find({
      where: searchObject,
      skip: taskExpenseDto.getStartIndex(),
      take: taskExpenseDto.getMaxResult(),
      order:{id:"DESC"}
    });
    return taskExpenseModel;
  }
  async findCount(taskExpenseDto: TaskExpenseDto): Promise<number> {
    let taskExpenseRepo = getConnection().getRepository(TaskExpenseEntity);
    let searchObject: any = this.prepareSearchObject(taskExpenseDto);
    let taskExpenseModel = await taskExpenseRepo.count({ where: searchObject });
    return taskExpenseModel;
  }
  async findById(taskId: number): Promise<TaskExpenseEntity> {
    let taskExpenseRepo = getConnection().getRepository(TaskExpenseEntity);
    let taskExpenseModel = await taskExpenseRepo.findOne(taskId);
    return taskExpenseModel;
  }

  async findByName(value: number): Promise<TaskExpenseEntity> {
    let taskExpenseRepo = getConnection().getRepository(TaskExpenseEntity);
    let taskExpenseModel = await taskExpenseRepo.findOne({ where: { value: value, status: Status.Online } });
    return taskExpenseModel;
  }
  async prepareTaskExpenseModel(taskExpenseModel: TaskExpenseEntity, taskExpenseDto: TaskExpenseDto) {
    taskExpenseModel.value = taskExpenseDto.getValue();
    taskExpenseModel.createdDate = new Date();
    taskExpenseModel.updatedDate = new Date();
    taskExpenseModel.status = Status.Online;
    taskExpenseModel.task.id = taskExpenseDto.getTaskId();
    taskExpenseModel.expense.id = taskExpenseDto.getExpenseId();
  }
  prepareSearchObject(taskExpenseDto: TaskExpenseDto): any {
    let searchObject: any = {};
    if (taskExpenseDto.getValue()) {
      searchObject.value = Like("%" + taskExpenseDto.getValue() + "%");
    }
    searchObject.workerStatus = WorkerStatus.Active;
    if (taskExpenseDto.getcreatedDate()) {
        searchObject.createdDate = Like("%" + taskExpenseDto.getcreatedDate() + "%");
    }
    if (taskExpenseDto.getUpdatedDate()) {
        searchObject.updatedDate = Like("%" + taskExpenseDto.getUpdatedDate() + "%");
    }
    searchObject.status = Status.Online;
    if (taskExpenseDto.getTaskId()) {
        searchObject.taskId = Like("%" + taskExpenseDto.getTaskId() + "%");
    }
    if (taskExpenseDto.getExpenseId()) {
        searchObject.expenseId = Like("%" + taskExpenseDto.getExpenseId() + "%");
    }
    return searchObject;
  }
}
