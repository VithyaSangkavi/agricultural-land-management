import { IncomeEntity } from "../../entity/master/Income";
import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/status";
import { Double } from "typeorm";

export class ExpensesDto extends PaginationDto {
    private income_id: number;
    private land_id: number;
    private month: string;
    private value: Double;
    private createdDate: Date;
    private updatedDate: Date;
    private status: Status;

    filViaRequest(body) {

        if (body.income_id) {
            this.income_id = body.income_id;
        }
        this.land_id = body.land_id;
        this.month = body.month;
        this.value = body.value;
        this.createdDate = body.createdDate;
        this.updatedDate = body.updatedDate;
        this.status = body.status;
        if (body.startIndex && body.maxResult) {
            this.setStartIndex(body.startIndex);
            this.setMaxResult(body.maxResult);
        }
    }

    filViaDbObject(incomeModel: IncomeEntity) {
        this.income_id = incomeModel.income_id;
        this.land_id = incomeModel.land_id;
        this.month = incomeModel.month;
        this.value = incomeModel.value;
        this.createdDate = incomeModel.createdDate;
        this.updatedDate = incomeModel.updatedDate;
        this.status = incomeModel.status
    }

    public getIncomeId(): number {
        return this.income_id;
    }

    public setIncomeId(income_id: number): void {
        this.income_id = income_id;
    }

    public getLandId(): number {
        return this.land_id;
    }

    public setLandId(land_id: number): void {
        this.land_id = land_id;
    }

    public getMonth(): string {
        return this.month;
    }

    public setMonth(month: string): void {
        this.month = month;
    }

    public getValue(): Double {
        return this.value;
    }

    public setValue(value: Double): void {
        this.value = value;
    }
    
    public getCreatedDate(): Date {
        return this.createdDate;
    }

    public setCreatedDate(createdDate: Date): void {
        this.createdDate = createdDate;
    }

    public getUpdatedDate(): Date {
        return this.updatedDate;
    }

    public setUpdatedDate(updatedDate: Date): void {
        this.updatedDate = updatedDate;
    }

    public getStatus(): Status {
        return this.status;
    }

    public setStatus(status: Status): void {
        this.status = status;
    }
}