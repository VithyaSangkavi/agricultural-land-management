import { getConnection, Like } from "typeorm";
import { CropDto } from "../../dto/master/crop-dto";
import { Status } from "../../enum/status";
import { CropEntity } from "../../entity/master/Crop";
import { CropDao } from "../crop-dao";

export class CropDaoImpl implements CropDao {
  async save(cropDto: CropDto): Promise<CropEntity> {
    let cropRepo = getConnection().getRepository(CropEntity);
    let cropModel = new CropEntity();

    cropModel.status = Status.Online;
    this.prepareCropModel(cropModel, cropDto);
    let savedCrop = await cropRepo.save(cropModel);
    return savedCrop;
  }
  async update(cropDto: CropDto): Promise<CropEntity> {
    let cropRepo = getConnection().getRepository(CropEntity);

    let cropId = cropDto.getCropId() //changed this code, this is noy original structure
    let cropModel = await cropRepo.findOne({ where: { crop_id: cropId } }); //changed this code, this is noy original structure
        
    if (cropModel) {
      this.prepareCropModel(cropModel, cropDto);
      let updatedModel = await cropRepo.save(cropModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(cropDto: CropDto): Promise<CropEntity> {
    let cropRepo = getConnection().getRepository(CropEntity);

    let cropId = cropDto.getCropId() //changed this code, this is noy original structure
    let cropModel = await cropRepo.findOne({ where: { crop_id: cropId } }); //changed this code, this is noy original structure

    if (cropModel) {
      cropModel.status = Status.Offline;
      let updatedModel = await cropRepo.save(cropModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(cropDto: CropDto): Promise<CropEntity[]> {
    let cropRepo = getConnection().getRepository(CropEntity);
    let searchObject: any = this.prepareSearchObject(cropDto);
    let cropModel = await cropRepo.find({
      where: searchObject,
      skip: cropDto.getStartIndex(),
      take: cropDto.getMaxResult(),
      order: { crop_id: "DESC" }
    });
    return cropModel;
  }

  async findById(crop_id: number): Promise<CropEntity> {
    let cropRepo = getConnection().getRepository(CropEntity);
    let cropModel = await cropRepo.findOne({ where: { crop_id } });//changed this code, this is noy original structure
    return cropModel;
  }

  async prepareCropModel(cropModel: CropEntity, cropDto: CropDto) {
    cropModel.land_id = cropDto.getLandId();
    cropModel.name = cropDto.getName();
    cropModel.createdDate = cropDto.getCreatedDate();
    cropModel.updatedDate = cropDto.getUpdatedDate();
    cropModel.status = cropDto.getStatus();

  }
  prepareSearchObject(cropDto: CropDto): any {
    let searchObject: any = {};

    if (cropDto.getLandId()) {
      searchObject.land_id = Like("%" + cropDto.getLandId() + "%");
    }
    if (cropDto.getName()) {
      searchObject.name = Like("%" + cropDto.getName() + "%");
    }
    if (cropDto.getCreatedDate()) {
      searchObject.createdDate = Like("%" + cropDto.getCreatedDate() + "%");
    }

    if (cropDto.getUpdatedDate()) {
      searchObject.updatedDate = Like("%" + cropDto.getUpdatedDate() + "%");
    }

    searchObject.status = Status.Online;

    return searchObject;
  }
}
