import { CommonResponse } from "../../../common/dto/common-response";
import { CropDao } from "../../../dao/crop-dao";
import { CropDaoImpl } from "../../../dao/impl/crop-dao-impl";
import { CropDto } from "../../../dto/master/crop-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { CropService } from "../crop-service";

/**
 * crop service layer
 *
 */
export class CropServiceImpl implements CropService {
  cropDao: CropDao = new CropDaoImpl();

  /**
   * save new crop
   * @param cropDto
   * @returns
   */
  async save(cropDto: CropDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (cropDto.getCropName) {
        // check name already have
        let nameCropMode = await this.cropDao.findByName(cropDto.getCropName());
        if (nameCropMode) {
          return CommonResSupport.getValidationException("Crop Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Crop Name Cannot Be null !");
      }

      // save new crop
      let newCrop = await this.cropDao.save(cropDto);
      cr.setStatus(true);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update crop
   * @param cropDto
   * @returns
   */
  async update(cropDto: CropDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (cropDto.getCropName()) {
        // check name already have
        let nameCropMode = await this.cropDao.findByName(cropDto.getCropName());
        if (nameCropMode && nameCropMode.id != cropDto.getCropId()) {
          return CommonResSupport.getValidationException("Crop Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Crop Name Cannot Be null !");
      }

      // update crop
      let updateCrop = await this.cropDao.update(cropDto);
      if (updateCrop) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Crop Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete crop
   * not delete from db.just update its status as offline
   * @param cropDto
   * @returns
   */
  async delete(cropDto: CropDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete crop
      let deleteCrop = await this.cropDao.delete(cropDto);
      if (deleteCrop) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Crop Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all crops
   * @returns
   */
  async find(cropDto: CropDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find crop
      let crops = await this.cropDao.findAll(cropDto);
      let cropDtoList = new Array();
      for (const cropModel of crops) {
        let cropDto = new CropDto();
        cropDto.filViaDbObject(cropModel);
        cropDtoList.push(cropDto);
      }
      if (cropDto.getStartIndex() == 0) {
        let count = await this.cropDao.findCount(cropDto);
        cr.setCount(count);
      }
      cr.setStatus(true);
      cr.setExtra(cropDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find crop by id
   * @param cropId
   * @returns
   */
  async findById(cropId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find crop
      let crop = await this.cropDao.findById(cropId);

      let cropDto = new CropDto();
      cropDto.filViaDbObject(crop);

      cr.setStatus(true);
      cr.setExtra(cropDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
}
