import { CommonResponse } from "../../../common/dto/common-response";
import { TaskAssignedDao } from "../../../dao/task-assigned-dao";
import { TaskAssignedDaoImpl } from "../../../dao/impl/task-assigned-dao-impl";
import { TaskAssignedDto } from "../../../dto/master/task-assigned-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { TaskAssignedService } from "../task-assigned-service";

/**
 * taskAssigned service layer
 *
 */
export class taskAssignedServiceImpl implements TaskAssignedService {
  taskAssignedDao: TaskAssignedDao = new TaskAssignedDaoImpl();

  /**
   * save new taskAssigned
   * @param taskAssignedDto
   * @returns
   */
  async save(taskAssignedDto: TaskAssignedDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (taskAssignedDto.getTaskAssignedId()) {
        // check name already have
        let quantitytaskAssignedMode = await this.taskAssignedDao.findById(taskAssignedDto.getTaskAssignedId());
        if (quantitytaskAssignedMode) {
          return CommonResSupport.getValidationException("taskAssigned id Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("taskAssigned id Cannot Be null !");
      }

      // save new taskAssigned
      let newtaskAssigned = await this.taskAssignedDao.save(taskAssignedDto);
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
        let quantitytaskAssignedMode = await this.taskAssignedDao.findById(taskAssignedDto.getTaskAssignedId());
        if (quantitytaskAssignedMode && quantitytaskAssignedMode.id != taskAssignedDto.getTaskAssignedId()) {
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
      let taskAssigneds = await this.taskAssignedDao.findAll(taskAssignedDto);
      let taskAssignedDtoList = new Array();
      for (const taskAssignedModel of taskAssigneds) {
        let taskAssignedDto = new TaskAssignedDto();
        taskAssignedDto.filViaDbObject(taskAssignedModel);
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
}
