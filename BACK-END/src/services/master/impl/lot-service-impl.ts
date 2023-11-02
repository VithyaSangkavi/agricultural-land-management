import { CommonResponse } from "../../../common/dto/common-response";
import { LotDao } from "../../../dao/lot-dao";
import { LotDaoImpl } from "../../../dao/impl/lot-dao-impl";
import { LotDto } from "../../../dto/master/lot-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { LotService } from "../lot-service";
import { LandDao } from "../../../dao/land-dao";
import { LandDaoImpl } from "../../../dao/impl/land-dao-impl";
import { LandEntity } from "../../../entity/master/land-entity";



/**lot
 * lot service layer
 *
 */
export class LotServiceImpl implements LotService {
  lotDao: LotDao = new LotDaoImpl();
  landDao: LandDao = new LandDaoImpl();

  /**
   * save new lot
   * @param lotDto
   * @returns
   */
  async save(lotDto: LotDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (lotDto.getLotName()) {
        // check name already have
        let nameLotMode = await this.lotDao.findByName(lotDto.getLotName());
        if (nameLotMode) {
          return CommonResSupport.getValidationException("Lot Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Lot Name Cannot Be null !");
      }

      //check land id
      let landModel: LandEntity = null;
      if (lotDto.getLandId() > 0) {
        landModel = await this.landDao.findById(lotDto.getLandId());
      } else {

        return CommonResSupport.getValidationException("Land with the specified ID does not exist!");
      }

      // save new lot
      let newLot = await this.lotDao.save(lotDto, landModel);
      cr.setStatus(true);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update lot
   * @param lotDto
   * @returns
   */
  async update(lotDto: LotDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (lotDto.getLotName()) {
        // check name already have
        let nameLotMode = await this.lotDao.findByName(lotDto.getLotName());
        if (nameLotMode && nameLotMode.id != lotDto.getLotId()) {
          return CommonResSupport.getValidationException("Lot Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Lot Name Cannot Be null !");
      }

      // update lot
      let updateLot = await this.lotDao.update(lotDto);
      if (updateLot) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Lot Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete lot
   * not delete from db.just update its status as offline
   * @param lotDto
   * @returns
   */
  async delete(lotDto: LotDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete lot
      let deleteLot = await this.lotDao.delete(lotDto);
      if (deleteLot) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Lot Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all lots
   * @returns
   */
  async find(lotDto: LotDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find lot
      let lots = await this.lotDao.findAll(lotDto);
      let lotDtoList = new Array();
      for (const lotModel of lots) {
        let lotDto = new LotDto();
        lotDto.filViaRequest(lotModel);
        lotDtoList.push(lotDto);
      }
      cr.setStatus(true);
      cr.setExtra(lotDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  async findByLandId(land: string): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try{
      let lots = await this.lotDao.findByLandId(land);
      let lotDtoList = new Array();
      for (const lotModel of lots) {
        let lotDto = new LotDto();
        lotDto.filViaRequest(lotModel);
        lotDtoList.push(lotDto);
      }
      cr.setStatus(true);
      cr.setExtra(lotDtoList);
    }catch(error){
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr
    
  }
  /**
   * find lot by id
   * @param lotId
   * @returns
   */
  async findById(lotId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find lot
      let lot = await this.lotDao.findById(lotId);

      let lotDto = new LotDto();
      lotDto.filViaDbObject(lot);

      cr.setStatus(true);
      cr.setExtra(lotDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  async findLotByLandId(landId: number): Promise<CommonResponse> {
    const cr = new CommonResponse();
    try {
      let lot = await this.lotDao.findLotByLandId(landId);
  
      console.log('service: ', lot);
  
      let lotDto = new LotDto();
      console.log('middle');
      lotDto.filViaRequest(lot);
      console.log('end');
      cr.setStatus(true);
      cr.setExtra(lotDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

}
