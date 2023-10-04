import { getConnection, Like } from "typeorm";
import { IncomeDto } from "../../dto/master/income-dto";
import { Status } from "../../enum/Status";
import { IncomeEntity } from "../../entity/master/income-entity";
import { IncomeDao } from "../income-dao";

/**
 * department data access layer
 * contain crud method
 */
export class IncomeDaoImpl implements IncomeDao {
  async save(incomeDto: IncomeDto): Promise<IncomeEntity> {
    let incomeRepo = getConnection().getRepository(IncomeEntity);
    let incomeModel = new IncomeEntity();

    incomeModel.status = Status.Online;
    this.prepareincomeModel(incomeModel, incomeDto);
    let savedDept = await incomeRepo.save(incomeModel);
    return savedDept;
  }
  async update(incomeDto: IncomeDto): Promise<IncomeEntity> {
    let incomeRepo = getConnection().getRepository(IncomeEntity);
    let incomeModel = await incomeRepo.findOne(incomeDto.getIncomeId());
    if (incomeModel) {
      this.prepareincomeModel(incomeModel, incomeDto);
      let updatedModel = await incomeRepo.save(incomeModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(incomeDto: IncomeDto): Promise<IncomeEntity> {
    let incomeRepo = getConnection().getRepository(IncomeEntity);
    let incomeModel = await incomeRepo.findOne(incomeDto.getIncomeId());
    if (incomeModel) {
      incomeModel.status = Status.Offline;
      let updatedModel = await incomeRepo.save(incomeModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(incomeDto: IncomeDto): Promise<IncomeEntity[]> {
    let incomeRepo = getConnection().getRepository(IncomeEntity);
    let searchObject: any = this.prepareSearchObject(incomeDto);
    let incomeModel = await incomeRepo.find({
      where: searchObject,
      skip: incomeDto.getStartIndex(),
      take: incomeDto.getMaxResult(),
      order:{id:"DESC"}
    });
    return incomeModel;
  }
  async findCount(incomeDto: IncomeDto): Promise<number> {
    let incomeRepo = getConnection().getRepository(IncomeEntity);
    let searchObject: any = this.prepareSearchObject(incomeDto);
    let incomeModel = await incomeRepo.count({ where: searchObject });
    return incomeModel;
  }
  async findById(departmentId: number): Promise<IncomeEntity> {
    let incomeRepo = getConnection().getRepository(IncomeEntity);
    let incomeModel = await incomeRepo.findOne(departmentId);
    return incomeModel;
  }

  async findByName(name: String): Promise<IncomeEntity> {
    let incomeRepo = getConnection().getRepository(IncomeEntity);
    let incomeModel = await incomeRepo.findOne({ where: { name: name, status: Status.Online } });
    return incomeModel;
  }
  async prepareincomeModel(incomeModel: IncomeEntity, incomeDto: IncomeDto) {
    incomeModel.month = incomeDto.getMonth();
    incomeModel.price = incomeDto.getPrice();
    incomeModel.createdDate = incomeDto.getCreatedDate();
    incomeModel.updatedDate = incomeDto.getUpdatedDate();
    incomeModel.status = incomeDto.getStatus();
    incomeModel.land.id = incomeDto.getLandId();
  }
  prepareSearchObject(incomeDto: IncomeDto): any {
    let searchObject: any = {};
    if (incomeDto.getMonth()) {
        searchObject.name = Like("%" + incomeDto.getMonth() + "%");
    }
    if (incomeDto.getPrice()) {
      searchObject.name = Like("%" + incomeDto.getPrice() + "%");
    }
    if (incomeDto.getCreatedDate()) {
      searchObject.color = Like("%" + incomeDto.getCreatedDate() + "%");
    }
    if (incomeDto.getUpdatedDate()) {
      searchObject.color = Like("%" + incomeDto.getUpdatedDate() + "%");
    }
    
    searchObject.status = Status.Online;
    
    if (incomeDto.getLandId()) {
      searchObject.color = Like("%" + incomeDto.getLandId() + "%");
    }
    return searchObject;
  }
}
