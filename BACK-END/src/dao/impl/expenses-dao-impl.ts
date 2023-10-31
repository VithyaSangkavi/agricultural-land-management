import { getConnection, Like } from "typeorm";
import { ExpensesDto } from "../../dto/master/expenses-dto";
import { Status } from "../../enum/Status";
import { ExpensesEntity } from "../../entity/master/expense-entity";
import { ExpensesDao } from "../expenses-dao";

/**
 * department data access layer
 * contain crud method
 */
export class ExpensesDaoImpl implements ExpensesDao {
  async save(expensesDto: ExpensesDto): Promise<ExpensesEntity> {
    let expensesRepo = getConnection().getRepository(ExpensesEntity);
    let expensesModel = new ExpensesEntity();

    expensesModel.status = Status.Online;
    this.prepareExpensesModel(expensesModel, expensesDto);
    let savedDept = await expensesRepo.save(expensesModel);
    return savedDept;
  }
  async update(expensesDto: ExpensesDto): Promise<ExpensesEntity> {
    let expensesRepo = getConnection().getRepository(ExpensesEntity);
    let expensesModel = await expensesRepo.findOne(expensesDto.getExpensesId());
    if (expensesModel) {
      this.prepareExpensesModel(expensesModel, expensesDto);
      let updatedModel = await expensesRepo.save(expensesModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(expensesDto: ExpensesDto): Promise<ExpensesEntity> {
    let expensesRepo = getConnection().getRepository(ExpensesEntity);
    let expensesModel = await expensesRepo.findOne(expensesDto.getExpensesId());
    if (expensesModel) {
      expensesModel.status = Status.Offline;
      let updatedModel = await expensesRepo.save(expensesModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(expensesDto: ExpensesDto): Promise<ExpensesEntity[]> {
    let expensesRepo = getConnection().getRepository(ExpensesEntity);
    let searchObject: any = this.prepareSearchObject(expensesDto);
    let expensesModel = await expensesRepo.find({
      where: searchObject,
      skip: expensesDto.getStartIndex(),
      take: expensesDto.getMaxResult(),
      order:{id:"DESC"}
    });
    return expensesModel;
  }
  async findCount(expensesDto: ExpensesDto): Promise<number> {
    let expensesRepo = getConnection().getRepository(ExpensesEntity);
    let searchObject: any = this.prepareSearchObject(expensesDto);
    let expensesModel = await expensesRepo.count({ where: searchObject });
    return expensesModel;
  }
  async findById(expenseId: number): Promise<ExpensesEntity> {
    let expensesRepo = getConnection().getRepository(ExpensesEntity);
    let expensesModel = await expensesRepo.findOne(expenseId);
    return expensesModel;
  }

  async findByName(name: String): Promise<ExpensesEntity> {
    let expensesRepo = getConnection().getRepository(ExpensesEntity);
    let expensesModel = await expensesRepo.findOne({ where: { name: name, status: Status.Online } });
    return expensesModel;
  }

  async findIdByType(expenseType: string): Promise<number | null> {
    let expensesRepo = getConnection().getRepository(ExpensesEntity);
    const expensesModel = await expensesRepo.findOne({ where: { expenseType: expenseType, status: Status.Online } });
    return expensesModel ? expensesModel.id : null;
  }

  async prepareExpensesModel(expensesModel: ExpensesEntity, expensesDto: ExpensesDto) {
    expensesModel.expenseType = expensesDto.getExpenseType();
    expensesModel.createdDate = new Date();
    expensesModel.updatedDate = new Date();
    expensesModel.status = Status.Online;
  }
  prepareSearchObject(expensesDto: ExpensesDto): any {
    let searchObject: any = {};
    if (expensesDto.getExpenseType()) {
      searchObject.expenseType = Like("%" + expensesDto.getExpenseType() + "%");
    }

    
    searchObject.status = Status.Online;
    
    return searchObject;
  }
}
