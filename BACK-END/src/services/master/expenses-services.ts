import { CommonResponse } from "../../common/dto/common-response";
import { ExpensesDto } from "../../dto/master/expenses-dto";

export interface ExpensesService {
    save(expensesDto: ExpensesDto): Promise<CommonResponse>;
    update(expensesDto: ExpensesDto): Promise<CommonResponse>;
    delete(expensesDto: ExpensesDto): Promise<CommonResponse>;
    findAll(expensesDto: ExpensesDto): Promise<CommonResponse[]>;
    findById(expenses_id: number): Promise<CommonResponse>;
}