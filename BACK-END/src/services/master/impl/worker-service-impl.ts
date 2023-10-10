import { CommonResponse } from "../../../common/dto/common-response";
import { WorkerDao } from "../../../dao/worker-dao";
import { WorkerDaoImpl } from "../../../dao/impl/worker-dao-impl";
import { WorkerDto } from "../../../dto/master/worker-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { WorkerService } from "../worker-service";
import { LandDto } from "../../../dto/master/land-dto";
import { LandDao } from "../../../dao/land-dao";
import { LandDaoImpl } from "../../../dao/impl/land-dao-impl";
import { LandEntity } from "../../../entity/master/land-entity";

/**
 * worker service layer
 *
 */
export class WorkerServiceImpl implements WorkerService {
  workerDao: WorkerDao = new WorkerDaoImpl();
  landDao: LandDao = new LandDaoImpl();

  /**
   * save new worker
   * @param workerDto
   * @returns
   */
  async save(workerDto: WorkerDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (workerDto.getName()) {
        // check name already have
        let nameWorkerMode = await this.workerDao.findByName(workerDto.getName());
        if (nameWorkerMode) {
          return CommonResSupport.getValidationException("Worker Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Worker Name Cannot Be null !");
      }
      
      //check land id
      let landModel:LandEntity = null;
      if(workerDto.getLandId() > 0){
        landModel = await this.landDao.findById(workerDto.getLandId());
      } else{ 
        
        return CommonResSupport.getValidationException("Land with the specified ID does not exist!");
      }
        
      // save new worker
      let newworker = await this.workerDao.save(workerDto, landModel);
      cr.setStatus(true);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update worker
   * @param workerDto
   * @returns
   */
  async update(workerDto: WorkerDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (workerDto.getName()) {
        // check name already have
        let nameWorkerMode = await this.workerDao.findByName(workerDto.getName());
        if (nameWorkerMode && nameWorkerMode.id != workerDto.getWorkerId()) {
          return CommonResSupport.getValidationException("Worker Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Worker Name Cannot Be null !");
      }

      // update worker
      let updateWorker = await this.workerDao.update(workerDto);
      if (updateWorker) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("worker Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete worker
   * not delete from db.just update its status as offline
   * @param workerDto
   * @returns
   */
  async delete(workerDto: WorkerDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete worker
      let deleteWorker = await this.workerDao.delete(workerDto);
      if (deleteWorker) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("worker Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all workers
   * @returns
   */
  async find(workerDto: WorkerDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find worker
      let workers = await this.workerDao.findAll(workerDto);
      let workerDtoList = new Array();
      for (const workerModel of workers) {
        let workerDto = new WorkerDto();
        workerDto.filViaDbObject(workerModel);
        workerDtoList.push(workerDto);
      }
      if (workerDto.getStartIndex() == 0) {
        let count = await this.workerDao.findCount(workerDto);
        cr.setCount(count);
      }
      cr.setStatus(true);
      cr.setExtra(workerDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find worker by id
   * @param workerId
   * @returns
   */
  async findById(workerId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find worker
      let worker = await this.workerDao.findById(workerId);

      let workerDto = new WorkerDto();
      workerDto.filViaDbObject(worker);

      cr.setStatus(true);
      cr.setExtra(workerDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
}
