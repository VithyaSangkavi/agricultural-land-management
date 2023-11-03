import { CommonResponse } from "../../../common/dto/common-response";
import { TaskCardDao } from "../../../dao/task-card-dao";
import { TaskCardDaoImpl } from "../../../dao/impl/task-card-dao-impl";
import { TaskCardDto } from "../../../dto/master/task-card-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { TaskCardService } from "../task-card-service";

/**
 * taskCard service layer
 *
 */
export class TaskCardServiceImpl implements TaskCardService {
  taskCardDao: TaskCardDao = new TaskCardDaoImpl();

  /**
   * save new taskCard
   * @param taskCardDto
   * @returns
   */
  async save(taskCardDto: TaskCardDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // save new taskCard
      let newTaskCard = await this.taskCardDao.save(taskCardDto);
      cr.setStatus(true);
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
  async update(taskCardDto: TaskCardDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // update taskCard
      let updateTaskCard = await this.taskCardDao.update(taskCardDto);
      if (updateTaskCard) {
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
}
