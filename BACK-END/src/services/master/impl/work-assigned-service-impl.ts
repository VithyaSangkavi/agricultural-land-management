import { CommonResponse } from "../../../common/dto/common-response";
import { WorkAssignedDao } from "../../../dao/work-assigned-dao";
import { WorkAssignedDaoImpl } from "../../../dao/impl/work-assigned-dao-impl";
import { WorkAssignedDto } from "../../../dto/master/work-assigned-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { WorkAssignedService } from "../work-assigned-service";
import { WorkerDao } from "../../../dao/worker-dao";
import { WorkerDaoImpl } from "../../../dao/impl/worker-dao-impl";
import { TaskTypeDao } from "../../../dao/task-type-dao";
import { TaskTypeDaoImpl } from "../../../dao/impl/task-type-dao-impl";
import { LotDao } from "../../../dao/lot-dao";
import { LotDaoImpl } from "../../../dao/impl/lot-dao-impl";
import { TaskAssignedDao } from "../../../dao/task-assigned-dao";
import { TaskAssignedDaoImpl } from "../../../dao/impl/task-assigned-dao-impl";
import { WorkerEntity } from "../../../entity/master/worker-entity";
import { TaskTypeEntity } from "../../../entity/master/task-type-entity";
import { LotEntity } from "../../../entity/master/lot-entity";
import { TaskAssignedEntity } from "../../../entity/master/task-assigned-entity";

/**
 * workAssigned service layer
 *
 */
export class WorkAssignedServiceImpl implements WorkAssignedService {
  workAssignedDao: WorkAssignedDao = new WorkAssignedDaoImpl();
  workerDao: WorkerDao = new WorkerDaoImpl();
  taskTypeDao: TaskTypeDao = new TaskTypeDaoImpl();
  lotDao: LotDao = new LotDaoImpl();
  taskAssignedDao: TaskAssignedDao = new TaskAssignedDaoImpl();

  /**
   * save new workAssigned
   * @param workAssignedDto
   * @returns
   */
  async save(workAssignedDto: WorkAssignedDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
       //check worker id
       let workerModel: WorkerEntity = null;
       if(workAssignedDto.getworkerId() > 0){
         workerModel = await this.workerDao.findById(workAssignedDto.getworkerId());
       } else{ 
         return CommonResSupport.getValidationException("Worker with the specified ID does not exist!");
       }

       //check task type id
       let taskTypeModel: TaskTypeEntity = null;
       if(workAssignedDto.getTaskId() > 0){
         taskTypeModel = await this.taskTypeDao.findById(workAssignedDto.getTaskId());
       } else{ 
         return CommonResSupport.getValidationException("Task type with the specified ID does not exist!");
       }

       
       //check lot id
       let lotModel: LotEntity = null;
       if(workAssignedDto.getLotId() > 0){
         lotModel = await this.lotDao.findById(workAssignedDto.getLotId());
       } else{ 
         return CommonResSupport.getValidationException("Lot with the specified ID does not exist!");
       }
       
       //check task type id
       let taskAssignedModel: TaskAssignedEntity = null;
       if(workAssignedDto.getTaskId() > 0){
         taskAssignedModel = await this.taskAssignedDao.findById(workAssignedDto.getTaskAssignedId());
       } else{ 
         return CommonResSupport.getValidationException("Assigned task with the specified ID does not exist!");
       }

      // save new workAssigned
      let newworkAssigned = await this.workAssignedDao.save(workAssignedDto, workerModel, taskTypeModel, lotModel, taskAssignedModel);
      cr.setStatus(true);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update workAssigned
   * @param workAssignedDto
   * @returns
   */
  async update(workAssignedDto: WorkAssignedDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (workAssignedDto.getTaskStatus()) {
        // check name already have
        let quantityWorkAssignedMode = await this.workAssignedDao.findByName(workAssignedDto.getTaskStatus());
        if (quantityWorkAssignedMode && quantityWorkAssignedMode.id != workAssignedDto.getAttendanceid()) {
          return CommonResSupport.getValidationException("workAssigned Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("workAssigned Name Cannot Be null !");
      }

      // update workAssigned
      let updateWorkAssigned = await this.workAssignedDao.update(workAssignedDto);
      if (updateWorkAssigned) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("workAssigned Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete workAssigned
   * not delete from db.just update its status as offline
   * @param workAssignedDto
   * @returns
   */
  async delete(workAssignedDto: WorkAssignedDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete workAssigned
      let deleteWorkAssigned = await this.workAssignedDao.delete(workAssignedDto);
      if (deleteWorkAssigned) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("workAssigned Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all workAssigneds
   * @returns
   */
  async find(workAssignedDto: WorkAssignedDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find workAssigned
      let workAssigneds = await this.workAssignedDao.findAll(workAssignedDto);
      let workAssignedDtoList = new Array();
      for (const workAssignedModel of workAssigneds) {
        let workAssignedDto = new WorkAssignedDto();
        workAssignedDto.filViaDbObject(workAssignedModel);
        workAssignedDtoList.push(workAssignedDto);
      }
      if (workAssignedDto.getStartIndex() == 0) {
        let count = await this.workAssignedDao.findCount(workAssignedDto);
        cr.setCount(count);
      }
      cr.setStatus(true);
      cr.setExtra(workAssignedDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find workAssigned by id
   * @param workAssignedId
   * @returns
   */
  async findById(workAssignedId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find workAssigned
      let workAssigned = await this.workAssignedDao.findById(workAssignedId);

      let workAssignedDto = new WorkAssignedDto();
      workAssignedDto.filViaDbObject(workAssigned);

      cr.setStatus(true);
      cr.setExtra(workAssignedDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
}
