import { getConnection, Like } from "typeorm";
import { LotDto } from "../../dto/master/lot-dto";
import { Status } from "../../enum/Status";
import { LotEntity } from "../../entity/master/lot-entity";
import { LotDao } from "../lot-dao";
import { LandEntity } from "../../entity/master/land-entity";

/**
 * department data access layer
 * contain crud method
 */
export class LotDaoImpl implements LotDao {
  async save(lotDto: LotDto, landModel: LandEntity): Promise<LotEntity> {
    let lotRepo = getConnection().getRepository(LotEntity);
    let lotModel = new LotEntity();

    lotModel.land = landModel;
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
      order: { id: "DESC" }
    });
    return lotModel;
  }
  async findByLandId(land: string): Promise<LotEntity[]> {
    const lotRepository = getConnection().getRepository(LotEntity);
    let lotModel = await lotRepository.find({ where: { land: land } });
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

  async findLotByLandId(landId: number): Promise<LotEntity> {
    const lotRepo = getConnection().getRepository(LotEntity);
    console.log("Searching for landId:", landId);
    const lotModel = await lotRepo.findOne({
      where: { land: landId },
    }); 
    console.log("Query result:", lotModel); 
    return lotModel;
  }

  async preparelotModel(lotModel: LotEntity, lotDto: LotDto) {
    lotModel.name = lotDto.getLotName();
    lotModel.area = lotDto.getArea();
    lotModel.areaUOM = lotDto.getAreaUOM();
    lotModel.createdDate = new Date();
    lotModel.updatedDate = new Date();
    lotModel.status = Status.Online;
  }
  prepareSearchObject(lotDto: LotDto): any {
    let searchObject: any = {};
    if (lotDto.getLotName()) {
      searchObject.name = Like("%" + lotDto.getLotName() + "%");
    }

    searchObject.status = Status.Online;

    if (lotDto.getLandId()) {
      searchObject.landId = Like("%" + lotDto.getLandId() + "%");
    }
    return searchObject;
  }
}
