import { CommonResponse } from "../../../common/dto/common-response";
import { TaskCardDao } from "../../../dao/task-card-dao";
import { TaskCardDaoImpl } from "../../../dao/impl/task-card-dao-impl";
import { TaskCardDto } from "../../../dto/master/task-card-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { TaskCardService } from "../task-card-service";
import { TaskAssignedEntity } from "../../../entity/master/task-assigned-entity";
import { TaskAssignedDao } from "../../../dao/task-assigned-dao";
import { TaskAssignedDaoImpl } from "../../../dao/impl/task-assigned-dao-impl";

/**
 * taskCard service layer
 *
 */
export class TaskCardServiceImpl implements TaskCardService {
  taskCardDao: TaskCardDao = new TaskCardDaoImpl();
  taskAssignedDao: TaskAssignedDao = new TaskAssignedDaoImpl();

  /**
   * save new taskCard
   * @param taskCardDto
   * @returns
   */
  async save(taskCardDto: TaskCardDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      let taskAssignedModel:TaskAssignedEntity = null;
      if(taskCardDto.getTaskAssignedId() > 0){
        taskAssignedModel = await this.taskAssignedDao.findById(taskCardDto.getTaskAssignedId());
      } else{ 
        
        return CommonResSupport.getValidationException("Task assigned with the specified ID does not exist!");
      }
      // save new taskCard
      let newTaskCard = await this.taskCardDao.save(taskCardDto, taskAssignedModel);
      cr.setStatus(true);
      cr.setExtra(newTaskCard);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update taskCard
   * @param taskCardDto
   * @returns
   */
  async update(taskCardDto: TaskCardDto, id: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      if (id <= 0) {
        cr.setStatus(false);
        cr.setExtra("Invalid ID provided for the task card!");
        return cr;
      }
  
      // Update taskCard with the provided ID
      let updateTaskCard = await this.taskCardDao.update(taskCardDto, id);
      if (updateTaskCard) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Task card Not Found!");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  async updateStatus(taskCardId: number, newStatus: string): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      const updatedIncome = await this.taskCardDao.updateStatus(taskCardId, newStatus);

      let updatedIncomeDto = new TaskCardDto();
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

  
  /**
   * delete taskCard
   * not delete from db.just update its status as offline
   * @param taskCardDto
   * @returns
   */
  async delete(taskCardDto: TaskCardDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete taskCard
      let deleteTaskCard = await this.taskCardDao.delete(taskCardDto);
      if (deleteTaskCard) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("taskCard Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all taskCards
   * @returns
   */
  async find(taskCardDto: TaskCardDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find taskCard
      let taskCards = await this.taskCardDao.findAll(taskCardDto);
      let taskCardDtoList = new Array();
      for (const taskCardModel of taskCards) {
        let taskCardDto = new TaskCardDto();
        taskCardDto.filViaDbObject(taskCardModel);
        taskCardDtoList.push(taskCardDto);
      }
      if (taskCardDto.getStartIndex() == 0) {
        let count = await this.taskCardDao.findCount(taskCardDto);
        cr.setCount(count);
      }
      cr.setStatus(true);
      cr.setExtra(taskCardDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find taskCard by id
   * @param taskCardId
   * @returns
   */
  async findById(taskCardId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find taskCard
      let taskCard = await this.taskCardDao.findById(taskCardId);

      let taskCardDto = new TaskCardDto();
      taskCardDto.filViaDbObject(taskCard);

      cr.setStatus(true);
      cr.setExtra(taskCardDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  async findTaskCardByTaskId(taskId: number): Promise<CommonResponse> {
    const cr = new CommonResponse();
    try {
      let taskcard = await this.taskCardDao.findTaskCardByTaskId(taskId);
  
      console.log('service: ', taskcard);
  
      let taskCardDto = new TaskCardDto();
      console.log('middle');
      taskCardDto.filViaRequest(taskcard);
      console.log('end');
      cr.setStatus(true);
      cr.setExtra(taskCardDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
}
