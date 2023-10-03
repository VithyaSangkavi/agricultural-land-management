import { getConnection, Like } from "typeorm";
import { IncomeDto } from "../../dto/master/income-dto";
import { Status } from "../../enum/status";
import { IncomeEntity } from "../../entity/master/Income";
import { IncomeDao } from "../income-dao";

export class IncomeDaoImpl implements IncomeDao {
    async save(incomeDto: IncomeDto): Promise<IncomeEntity> {
        let incomeRepo = getConnection().getRepository(IncomeEntity);
        let incomeModel = new IncomeEntity();

        incomeModel.status = Status.Online;
        this.prepareIncomeModel(incomeModel, incomeDto);
        let savedIncome = await incomeRepo.save(incomeModel);
        return savedIncome;
    }
    async update(incomeDto: IncomeDto): Promise<IncomeEntity> {
        let incomeRepo = getConnection().getRepository(IncomeEntity);

        let incomeId = incomeDto.getIncomeId(); //changed this code, this is noy original structure
        let incomeModel = await incomeRepo.findOne({ where: { income_id: incomeId } }); //changed this code, this is noy original structure

        if (incomeModel) {
            this.prepareIncomeModel(incomeModel, incomeDto);
            let updatedModel = await incomeRepo.save(incomeModel);
            return updatedModel;
        } else {
            return null;
        }
    }
    async delete(incomeDto: IncomeDto): Promise<IncomeEntity> {
        let incomeRepo = getConnection().getRepository(IncomeEntity);

        let incomeId = incomeDto.getIncomeId(); //changed this code, this is noy original structure
        let incomeModel = await incomeRepo.findOne({ where: { income_id: incomeId } }); //changed this code, this is noy original structure

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
            order: { income_id: "DESC" }
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
        let incomeRepo = getConnection().getRepository(IncomeEntity);
        let incomeModel = await incomeRepo.findOne({ where: { income_id } }); //c
        return incomeModel;
    }
    async prepareIncomeModel(incomeModel: IncomeEntity, incomeDto: IncomeDto) {
        incomeModel.land_id = incomeDto.getLandId();
        incomeModel.month = incomeDto.getMonth();
        incomeModel.value = incomeDto.getValue();
        incomeModel.createdDate = incomeDto.getCreatedDate();
        incomeModel.updatedDate = incomeDto.getUpdatedDate();
        incomeModel.status = incomeDto.getStatus();
    }
    prepareSearchObject(incomeDto: IncomeDto): any {
        let searchObject: any = {};

        if (incomeDto.getLandId()) {
            searchObject.name = Like("%" + incomeDto.getLandId() + "%");
        }
        if (incomeDto.getMonth()) {
            searchObject.name = Like("%" + incomeDto.getMonth() + "%");
        }
        if (incomeDto.getValue()) {
            searchObject.name = Like("%" + incomeDto.getValue() + "%");
        }
        if (incomeDto.getCreatedDate()) {
            searchObject.createdDate = Like("%" + incomeDto.getCreatedDate() + "%");
        }

        if (incomeDto.getUpdatedDate()) {
            searchObject.updatedDate = Like("%" + incomeDto.getUpdatedDate() + "%");
        }

        searchObject.status = Status.Online;

        return searchObject;
    }
}