import { getConnection, Like } from "typeorm";
import { IncomeDto } from "../../dto/master/income-dto";
import { Status } from "../../enum/Status";
import { IncomeEntity } from "../../entity/master/income-entity";
import { IncomeDao } from "../income-dao";
import { LandEntity } from "../../entity/master/land-entity";

/**
 * department data access layer
 * contain crud method
 */
export class IncomeDaoImpl implements IncomeDao {
  async save(incomeDto: IncomeDto, landModel: LandEntity): Promise<IncomeEntity> {
    let incomeRepo = getConnection().getRepository(IncomeEntity);
    let incomeModel = new IncomeEntity();

    incomeModel.land = landModel;

    this.prepareincomeModel(incomeModel, incomeDto);
    let savedDept = await incomeRepo.save(incomeModel);
    return savedDept;
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
      order: { id: "DESC" }
    });
    return incomeModel;
  }
  async findCount(incomeDto: IncomeDto): Promise<number> {
    let incomeRepo = getConnection().getRepository(IncomeEntity);
    let searchObject: any = this.prepareSearchObject(incomeDto);
    let incomeModel = await incomeRepo.count({ where: searchObject });
    return incomeModel;
  }

  async findById(income_id: number): Promise<IncomeEntity> {
    const incomeRepository = getConnection().getRepository(IncomeEntity);
    const incomeModel = await incomeRepository.findOne(income_id);
    return incomeModel;
  }


  async findByLandId(land: number): Promise<IncomeEntity[]> {
    const incomeRepository = getConnection().getRepository(IncomeEntity);
    const incomeModels = await incomeRepository.find({ where: { landId: land } });
    return incomeModels;
  }



  async findByName(name: String): Promise<IncomeEntity> {
    let incomeRepo = getConnection().getRepository(IncomeEntity);
    let incomeModel = await incomeRepo.findOne({ where: { name: name, status: Status.Online } });
    return incomeModel;
  }

  async prepareincomeModel(incomeModel: IncomeEntity, incomeDto: IncomeDto) {
    incomeModel.month = incomeDto.getMonth();
    incomeModel.price = incomeDto.getPrice();
    incomeModel.createdDate = new Date();
    incomeModel.updatedDate = new Date();
    incomeModel.status = Status.Online
  }

  async updatePrice(incomeId: number, newPrice: number): Promise<IncomeEntity | null> {
    const incomeRepository = getConnection().getRepository(IncomeEntity);

    try {
        const existingIncome = await incomeRepository.findOne(incomeId);

        if (!existingIncome) {
            return null; 
        }

        existingIncome.price = newPrice;
        existingIncome.updatedDate = new Date();

        const updatedIncome = await incomeRepository.save(existingIncome);

        return updatedIncome;
    } catch (error) {
        throw error;
    }
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
