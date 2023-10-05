import { CommonResponse } from "../../../common/dto/common-response";
import { TaskTypeDao } from "../../../dao/task-type-dao";
import { TaskTypeDaoImpl } from "../../../dao/impl/task-type-dao-impl";
import { TaskTypeDto } from "../../../dto/master/task-type-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { TaskTypeService } from "../task-type-service";

/**
 * taskType service layer
 *
 */
export class TaskTypeServiceImpl implements TaskTypeService {
  taskTypeDao: TaskTypeDao = new TaskTypeDaoImpl();

  /**
   * save new taskType
   * @param taskTypeDto
   * @returns
   */
  async save(taskTypeDto: TaskTypeDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (taskTypeDto.getTaskName()) {
        // check name already have
        let nameTaskTypeMode = await this.taskTypeDao.findByName(taskTypeDto.getTaskName());
        if (nameTaskTypeMode) {
          return CommonResSupport.getValidationException("taskType Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("taskType Name Cannot Be null !");
      }

      // save new taskType
      let newtaskType = await this.taskTypeDao.save(taskTypeDto);
      cr.setStatus(true);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update taskType
   * @param taskTypeDto
   * @returns
   */
  async update(taskTypeDto: TaskTypeDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (taskTypeDto.getTaskName()) {
        // check name already have
        let nameTaskTypeMode = await this.taskTypeDao.findByName(taskTypeDto.getTaskName());
        if (nameTaskTypeMode && nameTaskTypeMode.id != taskTypeDto.getTaskTypeId()) {
          return CommonResSupport.getValidationException("taskType Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("taskType Name Cannot Be null !");
      }

      // update taskType
      let updateTaskType = await this.taskTypeDao.update(taskTypeDto);
      if (updateTaskType) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("taskType Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete taskType
   * not delete from db.just update its status as offline
   * @param taskTypeDto
   * @returns
   */
  async delete(taskTypeDto: TaskTypeDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete taskType
      let deleteTaskType = await this.taskTypeDao.delete(taskTypeDto);
      if (deleteTaskType) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("taskType Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all taskTypes
   * @returns
   */
  async find(taskTypeDto: TaskTypeDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find taskType
      let taskTypes = await this.taskTypeDao.findAll(taskTypeDto);
      let taskTypeDtoList = new Array();
      for (const taskTypeModel of taskTypes) {
        let taskTypeDto = new TaskTypeDto();
        taskTypeDto.filViaDbObject(taskTypeModel);
        taskTypeDtoList.push(taskTypeDto);
      }
      if (taskTypeDto.getStartIndex() == 0) {
        let count = await this.taskTypeDao.findCount(taskTypeDto);
        cr.setCount(count);
      }
      cr.setStatus(true);
      cr.setExtra(taskTypeDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find taskType by id
   * @param taskTypeId
   * @returns
   */
  async findById(taskTypeId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find taskType
      let taskType = await this.taskTypeDao.findById(taskTypeId);

      let taskTypeDto = new TaskTypeDto();
      taskTypeDto.filViaDbObject(taskType);

      cr.setStatus(true);
      cr.setExtra(taskTypeDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
}
