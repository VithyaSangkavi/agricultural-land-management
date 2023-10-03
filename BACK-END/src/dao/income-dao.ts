import { IncomeDto } from "../dto/master/income-dto";
import { IncomeEntity } from "../entity/master/Income";

export interface IncomeDao {
    save(incomeDto: IncomeDto): Promise<IncomeEntity>;
    update(incomeDto: IncomeDto): Promise<IncomeEntity>;
    delete(incomeDto: IncomeDto): Promise<IncomeEntity>;
    findAll(incomeDto: IncomeDto): Promise<IncomeEntity[]>;
    findById(income_id: number): Promise<IncomeEntity>;
}