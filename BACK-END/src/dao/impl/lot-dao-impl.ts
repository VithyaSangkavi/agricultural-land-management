import { getConnection, Like } from "typeorm";
import { LotDto } from "../../dto/master/lot-dto";
import { Status } from "../../enum/Status";
import { LotEntity } from "../../entity/master/lot-entity";
import { LotDao } from "../lot-dao";

/**
 * department data access layer
 * contain crud method
 */
export class LotDaoImpl implements LotDao {
  async save(lotDto: LotDto): Promise<LotEntity> {
    let lotRepo = getConnection().getRepository(LotEntity);
    let lotModel = new LotEntity();

    lotModel.status = Status.Online;
    this.preparelotModel(lotModel, lotDto);
    let savedDept = await lotRepo.save(lotModel);
    return savedDept;
  }
  async update(lotDto: LotDto): Promise<LotEntity> {
    let lotRepo = getConnection().getRepository(LotEntity);
    let lotModel = await lotRepo.findOne(lotDto.getLotId());
    if (lotModel) {
      this.preparelotModel(lotModel, lotDto);
      let updatedModel = await lotRepo.save(lotModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(lotDto: LotDto): Promise<LotEntity> {
    let lotRepo = getConnection().getRepository(LotEntity);
    let lotModel = await lotRepo.findOne(lotDto.getLotId());
    if (lotModel) {
      lotModel.status = Status.Offline;
      let updatedModel = await lotRepo.save(lotModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(lotDto: LotDto): Promise<LotEntity[]> {
    let lotRepo = getConnection().getRepository(LotEntity);
    let searchObject: any = this.prepareSearchObject(lotDto);
    let lotModel = await lotRepo.find({
      where: searchObject,
      skip: lotDto.getStartIndex(),
      take: lotDto.getMaxResult(),
      order:{id:"DESC"}
    });
    return lotModel;
  }
  async findCount(lotDto: LotDto): Promise<number> {
    let lotRepo = getConnection().getRepository(LotEntity);
    let searchObject: any = this.prepareSearchObject(lotDto);
    let lotModel = await lotRepo.count({ where: searchObject });
    return lotModel;
  }
  async findById(departmentId: number): Promise<LotEntity> {
    let lotRepo = getConnection().getRepository(LotEntity);
    let lotModel = await lotRepo.findOne(departmentId);
    return lotModel;
  }

  async findByName(name: String): Promise<LotEntity> {
    let lotRepo = getConnection().getRepository(LotEntity);
    let lotModel = await lotRepo.findOne({ where: { name: name, status: Status.Online } });
    return lotModel;
  }
  async preparelotModel(lotModel: LotEntity, lotDto: LotDto) {
    lotModel.lotName = lotDto.getLotName();
    lotModel.area = lotDto.getArea();
    lotModel.areaUOM = lotDto.getAreaUOM();
    lotModel.createdDate = lotDto.getCreatedDate();
    lotModel.updatedDate = lotDto.getUpdatedDate();
    lotModel.status = lotDto.getStatus();
    lotModel.land.id = lotDto.getLandId();
  }
  prepareSearchObject(lotDto: LotDto): any {
    let searchObject: any = {};
    if (lotDto.getLotName()) {
      searchObject.name = Like("%" + lotDto.getLotName() + "%");
    }
    if (lotDto.getArea()) {
        searchObject.name = Like("%" + lotDto.getArea() + "%");
    }
    if (lotDto.getAreaUOM()) {
        searchObject.name = Like("%" + lotDto.getAreaUOM() + "%");
    }
    if (lotDto.getCreatedDate()) {
      searchObject.color = Like("%" + lotDto.getCreatedDate() + "%");
    }
    if (lotDto.getUpdatedDate()) {
      searchObject.color = Like("%" + lotDto.getUpdatedDate() + "%");
    }
    
    searchObject.status = Status.Online;
    
    if (lotDto.getLandId()) {
      searchObject.color = Like("%" + lotDto.getLandId() + "%");
    }
    return searchObject;
  }
}
