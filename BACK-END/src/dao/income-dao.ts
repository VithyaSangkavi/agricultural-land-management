import { IncomeDto } from "../dto/master/income-dto";
import { IncomeEntity } from "../entity/master/income-entity";
import { LandEntity } from "../entity/master/land-entity";

export interface IncomeDao {
    save(incomeDto: IncomeDto, landModel:LandEntity): Promise<IncomeEntity>;
    update(incomeDto: IncomeDto): Promise<IncomeEntity>;
    delete(incomeDto: IncomeDto): Promise<IncomeEntity>;
    findAll(incomeDto: IncomeDto): Promise<IncomeEntity[]>;
    findById(income_id: number): Promise<IncomeEntity>;
    findByName(incomeDto: String): Promise<IncomeEntity>;
    findCount(incomeDto: IncomeDto): Promise<number>;
    findByLandId(land: string): Promise<IncomeEntity[]>;

}