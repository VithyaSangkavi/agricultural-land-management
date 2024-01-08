import { getConnection, Like } from "typeorm";
import { LandDto } from "../../dto/master/land-dto";
import { Status } from "../../enum/Status";
import { LandEntity } from "../../entity/master/land-entity";
import { LandDao } from "../land-dao";

/**
 * department data access layer
 * contain crud method
 */
export class LandDaoImpl implements LandDao {
  async save(landDto: LandDto): Promise<LandEntity> {
    let landRepo = getConnection().getRepository(LandEntity);
    let landModel = new LandEntity();

    landModel.status = Status.Online;
    this.preparelandModel(landModel, landDto);
    let savedDept = await landRepo.save(landModel);
    return savedDept;
  }
  async update(landDto: LandDto): Promise<LandEntity> {
    let landRepo = getConnection().getRepository(LandEntity);
    let landModel = await landRepo.findOne(landDto.getLandId());
    if (landModel) {
      this.preparelandModel(landModel, landDto);
      let updatedModel = await landRepo.save(landModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(landDto: LandDto): Promise<LandEntity> {
    let landRepo = getConnection().getRepository(LandEntity);
    let landModel = await landRepo.findOne(landDto.getLandId());
    if (landModel) {
      landModel.status = Status.Offline;
      let updatedModel = await landRepo.save(landModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(landDto: LandDto): Promise<LandEntity[]> {
    let landRepo = getConnection().getRepository(LandEntity);
    let searchObject: any = this.prepareSearchObject(landDto);
    let landModel = await landRepo.find({
      where: searchObject,
      skip: landDto.getStartIndex(),
      take: landDto.getMaxResult(),
      order:{id:"DESC"},
      relations: ["crop"]
    });
    return landModel;
  }
  async findCount(landDto: LandDto): Promise<number> {
    let landRepo = getConnection().getRepository(LandEntity);
    let searchObject: any = this.prepareSearchObject(landDto);
    let landModel = await landRepo.count({ where: searchObject });
    return landModel;
  }
  async findById(landId: number): Promise<LandEntity> {
    let landRepo = getConnection().getRepository(LandEntity);
    let landModel = await landRepo.findOne(landId);
    return landModel;
  }

  async findByName(name: String): Promise<LandEntity> {
    let landRepo = getConnection().getRepository(LandEntity);
    let landModel = await landRepo.findOne({ where: { name: name, status: Status.Online } });
    return landModel;
  }

  async findLandIdByName(name: string): Promise<number | null> {
    try {
      const landRepo = getConnection().getRepository(LandEntity);
      const landModel = await landRepo.findOne({
        where: { name, status: Status.Online },
        select: ['id'],
      });
  
      return landModel ? landModel.id : null;
    } catch (error) {
      console.error('Error finding land ID:', error);
      return null;
    }
  }

  async findCropIdByLandId(landId: number): Promise<number | null> {
    let landRepo = getConnection().getRepository(LandEntity);
    let landModel = await landRepo.findOne({
      where: { id: landId, status: Status.Online }, relations: ['crop']
    });
  
    if (landModel) {
      return landModel.crop.id;
    }
  
    return null;
  }  

  async preparelandModel(landModel: LandEntity, landDto: LandDto) {
    landModel.name = landDto.getlandName();
    landModel.area = landDto.getArea();
    landModel.areaUOM = landDto.getareaUOM();
    landModel.city = landDto.getCity();
    landModel.createdDate = new Date();
    landModel.updatedDate = new Date();
    landModel.status = Status.Online;
  }
  prepareSearchObject(landDto: LandDto): any {
    let searchObject: any = {};
    if (landDto.getlandName()) {
      searchObject.name = Like("%" + landDto.getlandName() + "%");
    }

    
    searchObject.status = Status.Online;
   
    return searchObject;
  }
}
