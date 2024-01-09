import { CommonResponse } from "../../../common/dto/common-response";
import { LandDao } from "../../../dao/land-dao";
import { LandDaoImpl } from "../../../dao/impl/land-dao-impl";
import { LandDto } from "../../../dto/master/land-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { LandService } from "../land-service";

/**land
 * land service layer
 *
 */
export class LandServiceImpl implements LandService {
  landDao: LandDao = new LandDaoImpl();

  /**
   * save new land
   * @param landDto
   * @returns
   */
  async save(landDto: LandDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (landDto.getlandName()) {
        // check name already have
        let nameLandMode = await this.landDao.findByName(landDto.getlandName());
        if (nameLandMode) {
          return CommonResSupport.getValidationException("Land Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Land Name Cannot Be null !");
      }

      // save new land
      let newLand = await this.landDao.save(landDto);
      cr.setStatus(true);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update land
   * @param landDto
   * @returns
   */
  async update(landDto: LandDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (landDto.getlandName()) {
        // check name already have
        let nameLandMode = await this.landDao.findByName(landDto.getlandName());
        if (nameLandMode && nameLandMode.id != landDto.getLandId()) {
          return CommonResSupport.getValidationException("Land Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Land Name Cannot Be null !");
      }

      // update land
      let updateLand = await this.landDao.update(landDto);
      if (updateLand) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Land Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete land
   * not delete from db.just update its status as offline
   * @param landDto
   * @returns
   */
  async delete(landDto: LandDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete land
      let deleteLand = await this.landDao.delete(landDto);
      if (deleteLand) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Land Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all lands
   * @returns
   */
  async find(landDto: LandDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find land
      let lands = await this.landDao.findAll(landDto);
      let landDtoList = new Array();
      console.log('land: ', lands)
      for (const landModel of lands) {
        let landDto = new LandDto();
        landDto.filViaDbObject(landModel);
        landDtoList.push(landDto);
      
      }
      if (landDto.getStartIndex() == 0) {
        let count = await this.landDao.findCount(landDto);
        cr.setCount(count);
      }
      cr.setStatus(true);
      cr.setExtra(landDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find land by id
   * @param landId
   * @returns
   */
  async findById(landId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find land
      let land = await this.landDao.findById(landId);

      let landDto = new LandDto();
      landDto.filViaDbObject(land);

      cr.setStatus(true);
      cr.setExtra(landDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  async findLandIdByName(name: string): Promise<CommonResponse> {
    const cr = new CommonResponse();
  
    try {
      const land = await this.landDao.findByName(name);
  
      if (land) {
        // Return only the land ID
        cr.setStatus(true);
        cr.setExtra({ landId: land.id });
      } else {
        cr.setStatus(false);
        cr.setExtra({ error: 'Land not found' });
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
  
    return cr;
  }

  /**
 * Find Crop ID by Land ID
 * @param landId - The Land ID to search for
 * @returns CommonResponse with Crop ID or an error message
 */
  async findCropIdByLandId(landId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      if (landId <= 0) {
        return CommonResSupport.getValidationException("Invalid Land ID");
      }

      const cropId = await this.landDao.findCropIdByLandId(landId);

      if (cropId !== null) {
        cr.setStatus(true);
        cr.setExtra(cropId);
      } else {
        return CommonResSupport.getValidationException("Crop not found for the given Land ID");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      console.log(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  
}
