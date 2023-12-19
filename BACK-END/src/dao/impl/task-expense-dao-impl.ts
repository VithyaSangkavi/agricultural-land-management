import { getConnection, Like } from "typeorm";
import { TaskExpenseDto } from "../../dto/master/task-expense-dto";
import { Status } from "../../enum/Status";
import { TaskExpenseEntity } from "../../entity/master/task-expense-entity";
import { TaskExpenseDao } from "../task-expense-dao";
import { TaskTypeEntity } from "../../entity/master/task-type-entity";
import { ExpensesEntity } from "../../entity/master/expense-entity";
import { TaskAssignedEntity } from "../../entity/master/task-assigned-entity";

/**
 * task-expense data access layer
 * contain crud method
 */
export class TaskExpenseDaoImpl implements TaskExpenseDao {
  async save(taskExpenseDto: TaskExpenseDto, taskTypeModel: TaskTypeEntity, expenseModel: ExpensesEntity, taskAssignedModel: TaskAssignedEntity): Promise<TaskExpenseEntity> {
    let taskExpenseRepo = getConnection().getRepository(TaskExpenseEntity);
    let taskExpenseModel = new TaskExpenseEntity();

    taskExpenseModel.taskType = taskTypeModel;
    taskExpenseModel.expense = expenseModel;
    taskExpenseModel.taskAssigned = taskAssignedModel
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
      order: { id: "DESC" }
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

  async findByExpenseId(expenseId: number): Promise<TaskExpenseEntity[]> {
    const taskExpenseRepo = getConnection().getRepository(TaskExpenseEntity);
    const taskExpenses = await taskExpenseRepo.find({ where: { expense: expenseId } });
    return taskExpenses;
  }

  async findByTaskAssignedId(taskAssignedId: number): Promise<TaskExpenseEntity[]> {
    let taskExpenseRepo = getConnection().getRepository(TaskExpenseEntity);
    const taskExpense = await taskExpenseRepo.find({
      where: {
        taskAssigned: { id: taskAssignedId }
      },
    });
    return taskExpense;
  }

  async prepareTaskExpenseModel(taskExpenseModel: TaskExpenseEntity, taskExpenseDto: TaskExpenseDto) {
    taskExpenseModel.value = taskExpenseDto.getValue();
    taskExpenseModel.createdDate = new Date();
    taskExpenseModel.updatedDate = new Date();
    taskExpenseModel.status = Status.Online;
  }

  prepareSearchObject(taskExpenseDto: TaskExpenseDto): any {
    let searchObject: any = {};
    if (taskExpenseDto.getValue()) {
      searchObject.value = Like("%" + taskExpenseDto.getValue() + "%");
    }
    if (taskExpenseDto.getcreatedDate()) {
      searchObject.createdDate = Like("%" + taskExpenseDto.getcreatedDate() + "%");
    }
    if (taskExpenseDto.getUpdatedDate()) {
      searchObject.updatedDate = Like("%" + taskExpenseDto.getUpdatedDate() + "%");
    }
    searchObject.status = Status.Online;
    if (taskExpenseDto.getTaskId()) {
      searchObject.taskType = Like("%" + taskExpenseDto.getTaskId() + "%");
    }
    if (taskExpenseDto.getExpenseId()) {
      searchObject.expenseId = Like("%" + taskExpenseDto.getExpenseId() + "%");
    }
    if (taskExpenseDto.getTaskAssignedId()) {
      searchObject.taskAssignedId = Like("%" + taskExpenseDto.getTaskAssignedId() + "%");
    }
    return searchObject;
  }
}
