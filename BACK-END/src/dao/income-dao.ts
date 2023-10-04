import { IncomeDto } from "../dto/master/income-dto";
import { IncomeEntity } from "../entity/master/income-entity";

export interface IncomeDao {
    save(incomeDto: IncomeDto): Promise<IncomeEntity>;
    update(incomeDto: IncomeDto): Promise<IncomeEntity>;
    delete(incomeDto: IncomeDto): Promise<IncomeEntity>;
    findAll(incomeDto: IncomeDto): Promise<IncomeEntity[]>;
    findById(income_id: number): Promise<IncomeEntity>;
}