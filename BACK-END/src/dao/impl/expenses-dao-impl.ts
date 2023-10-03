import { getConnection, Like } from "typeorm";
import { ExpensesDto } from "../../dto/master/expenses-dto";
import { Status } from "../../enum/status";
import { ExpensesEntity } from "../../entity/master/Expenses";
import { ExpensesDao } from "../expenses-dao";

export class ExpensesDaoImpl implements ExpensesDao {
    async save(expensesDto: ExpensesDto): Promise<ExpensesEntity> {
        let expensesRepo = getConnection().getRepository(ExpensesEntity);
        let expensesModel = new ExpensesEntity();

        expensesModel.status = Status.Online;
        this.prepareExpensesModel(expensesModel, expensesDto);
        let savedExpenses = await expensesRepo.save(expensesModel);
        return savedExpenses;
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
            order: { expenses_id: "DESC" }
        });
        return expensesModel;
    }
    async findCount(expensesDto: ExpensesDto): Promise<number> {
        let expensesRepo = getConnection().getRepository(ExpensesEntity);
        let searchObject: any = this.prepareSearchObject(expensesDto);
        let expensesModel = await expensesRepo.count({ where: searchObject });
        return expensesModel;
    }
    async findById(expenses_id: number): Promise<ExpensesEntity> {
        let expensesRepo = getConnection().getRepository(ExpensesEntity);
        let expensesModel = await expensesRepo.findOne(expenses_id);
        return expensesModel;
    }
    async prepareExpensesModel(expensesModel: ExpensesEntity, expensesDto: ExpensesDto) {
        expensesModel.type = expensesDto.getType();
        expensesModel.createdDate = expensesDto.getCreatedDate();
        expensesModel.updatedDate = expensesDto.getUpdatedDate();
        expensesModel.status = expensesDto.getStatus();
    }
    prepareSearchObject(expensesDto: ExpensesDto): any {
        let searchObject: any = {};
        
        if (expensesDto.getType()) {
            searchObject.name = Like("%" + expensesDto.getType() + "%");
        }
        if (expensesDto.getCreatedDate()) {
            searchObject.createdDate = Like("%" + expensesDto.getCreatedDate() + "%");
        }
    
        if (expensesDto.getUpdatedDate()) {
            searchObject.updatedDate = Like("%" + expensesDto.getUpdatedDate() + "%");
        }
    
        searchObject.status = Status.Online;
        return searchObject;
    }
}
