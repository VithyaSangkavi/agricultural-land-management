import { CommonResponse } from "../../common/dto/common-response";
import { IncomeDto } from "../../dto/master/income-dto";

export interface IncomeService {
    save(incomeDto: IncomeDto): Promise<CommonResponse>;
    update(incomeDto: IncomeDto): Promise<CommonResponse>;
    delete(incomeDto: IncomeDto): Promise<CommonResponse>;
    find(incomeDto: IncomeDto): Promise<CommonResponse>;
    findById(income_id: number): Promise<CommonResponse>;
    findByLandId(land: string): Promise<CommonResponse>;

}