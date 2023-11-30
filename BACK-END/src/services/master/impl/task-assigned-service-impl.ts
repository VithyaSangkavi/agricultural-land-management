import { CommonResponse } from "../../../common/dto/common-response";
import { TaskAssignedDao } from "../../../dao/task-assigned-dao";
import { TaskAssignedDaoImpl } from "../../../dao/impl/task-assigned-dao-impl";
import { TaskAssignedDto } from "../../../dto/master/task-assigned-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { TaskAssignedService } from "../task-assigned-service";
import { LandEntity } from "../../../entity/master/land-entity";
import { LandDao } from "../../../dao/land-dao";
import { LandDaoImpl } from "../../../dao/impl/land-dao-impl";
import { TaskTypeEntity } from "../../../entity/master/task-type-entity";
import { TaskTypeDao } from "../../../dao/task-type-dao";
import { TaskTypeDaoImpl } from "../../../dao/impl/task-type-dao-impl";
import { WorkAssignedEntity } from "../../../entity/master/work-assigned-entity";
import { getConnection } from "typeorm";
import { Status } from "../../../enum/Status";
import { TaskAssignedEntity } from "../../../entity/master/task-assigned-entity";

/**
 * taskAssigned service layer
 *
 */
export class TaskAssignedServiceImpl implements TaskAssignedService {
  taskAssignedDao: TaskAssignedDao = new TaskAssignedDaoImpl();
  landDao: LandDao = new LandDaoImpl();
  taskTypeDao: TaskTypeDao = new TaskTypeDaoImpl();

  /**
   * save new taskAssigned
   * @param taskAssignedDto
   * @returns
   */
  async save(taskAssignedDto: TaskAssignedDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {

      //check land id
      let landModel: LandEntity = null;
      if (taskAssignedDto.getLandId() > 0) {
        landModel = await this.landDao.findById(taskAssignedDto.getLandId());
      } else {
        return CommonResSupport.getValidationException("Land with the specified ID does not exist!");
      }

      //check task type id
      let taskTypeModel: TaskTypeEntity = null;
      if (taskAssignedDto.getTaskId() > 0) {
        taskTypeModel = await this.taskTypeDao.findById(taskAssignedDto.getTaskId());
      } else {
        return CommonResSupport.getValidationException("Task type with the specified ID does not exist!");
      }

      // save new taskAssigned
      let newtaskAssigned = await this.taskAssignedDao.save(taskAssignedDto, landModel, taskTypeModel);
      cr.setStatus(true);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update taskAssigned
   * @param taskAssignedDto
   * @returns
   */
  async update(taskAssignedDto: TaskAssignedDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (taskAssignedDto.getTaskAssignedId()) {
        // check name already have
        let statustaskAssignedMode = await this.taskAssignedDao.findByName(taskAssignedDto.getStatus());
        if (statustaskAssignedMode && statustaskAssignedMode.id != taskAssignedDto.getTaskAssignedId()) {
          return CommonResSupport.getValidationException("taskAssigned id Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("taskAssigned id Cannot Be null !");
      }

      // update taskAssigned
      let updatetaskAssigned = await this.taskAssignedDao.update(taskAssignedDto);
      if (updatetaskAssigned) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("taskAssigned Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete taskAssigned
   * not delete from db.just update its status as offline
   * @param taskAssignedDto
   * @returns
   */
  async delete(taskAssignedDto: TaskAssignedDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete taskAssigned
      let deletetaskAssigned = await this.taskAssignedDao.delete(taskAssignedDto);
      if (deletetaskAssigned) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("taskAssigned Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all taskAssigneds
   * @returns
   */
  async find(taskAssignedDto: TaskAssignedDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find taskAssigned
      let taskAssigned = await this.taskAssignedDao.findAll(taskAssignedDto);
      let taskAssignedDtoList = new Array();
      for (const taskAssignedModel of taskAssigned) {
        let taskAssignedDto = new TaskAssignedDto();
        taskAssignedDto.filViaRequest(taskAssignedModel);
        taskAssignedDtoList.push(taskAssignedDto);
      }
      if (taskAssignedDto.getStartIndex() == 0) {
        let count = await this.taskAssignedDao.findCount(taskAssignedDto);
        cr.setCount(count);
      }
      cr.setStatus(true);
      cr.setExtra(taskAssignedDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find taskAssigned by id
   * @param taskAssignedId
   * @returns
   */
  async findById(taskAssignedId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find taskAssigned
      let taskAssigned = await this.taskAssignedDao.findById(taskAssignedId);

      let taskAssignedDto = new TaskAssignedDto();
      taskAssignedDto.filViaDbObject(taskAssigned);

      cr.setStatus(true);
      cr.setExtra(taskAssignedDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  async findByTaskId(taskId: number): Promise<CommonResponse> {
    const cr = new CommonResponse();
    try {
      let taskAssigned = await this.taskAssignedDao.findByTaskId(taskId);

      console.log('service: ', taskAssigned);

      let taskAssignedDto = new TaskAssignedDto();
      console.log('middle');
      taskAssignedDto.filViaRequest(taskAssigned);
      console.log('end');
      cr.setStatus(true);
      cr.setExtra(taskAssignedDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  async getOngoingTasksWithTaskNames(): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      const taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);

      const taskDetails = await taskAssignedRepo
        .createQueryBuilder('taskAssigned')
        .innerJoin('taskAssigned.task', 'task')
        .where('taskAssigned.taskStatus = :taskStatus', { taskStatus: "ongoing" })
        .andWhere('taskAssigned.status = :status', { status: Status.Online })
        .groupBy('taskAssigned.taskAssignedId')
        .select(['taskAssigned.taskAssignedId as taskAssignedId', 'MAX(task.id) as taskId', 'MAX(task.taskName) as taskName','taskAssigned.startDate as taskStartDate','taskAssigned.landId as landId'])
        .getRawMany();

      cr.setStatus(true);
      cr.setExtra(taskDetails);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }

    return cr;
  }

  async getCompletedTasksWithTaskNames(): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      const taskAssignedRepo = getConnection().getRepository(TaskAssignedEntity);

      const taskDetails = await taskAssignedRepo
        .createQueryBuilder('taskAssigned')
        .innerJoin('taskAssigned.task', 'task')
        .where('taskAssigned.taskStatus = :taskStatus', { taskStatus: "completed" })
        .andWhere('taskAssigned.status = :status', { status: Status.Online })
        .groupBy('taskAssigned.taskAssignedId')
        .select(['taskAssigned.taskAssignedId as taskAssignedId', 'MAX(task.id) as taskId', 'MAX(task.taskName) as taskName','taskAssigned.startDate as taskStartDate','taskAssigned.landId as landId'])
        .getRawMany();

      cr.setStatus(true);
      cr.setExtra(taskDetails);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }

    return cr;
  }

  async updateEndDate(taskAssignedId: number, endDate: Date, newStatus: string): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      const updateEndDate = await this.taskAssignedDao.updateEndDate(taskAssignedId, endDate, newStatus);

      let updateEndDateDto = new TaskAssignedDto();
      updateEndDateDto.filViaRequest(updateEndDate);

      cr.setStatus(true);
      cr.setExtra(updateEndDateDto);

    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  async updateStatus(taskAssignedId: number, newStatus: string): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      const updatedIncome = await this.taskAssignedDao.updateStatus(taskAssignedId, newStatus);

      let updatedIncomeDto = new TaskAssignedDto();
      updatedIncomeDto.filViaRequest(updatedIncome);

      cr.setStatus(true);
      cr.setExtra(updatedIncomeDto);

    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }


}
