import { IncomeEntity } from "../../entity/master/income-entity";
import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/Status";

export class IncomeDto extends PaginationDto {
    private id: number;
    private month: string;
    private price: number;
    private createdDate: Date;
    private updatedDate: Date;
    private status: Status;
    private landId: number;

    filViaRequest(body) {

        if (body.id) {
            this.id = body.id;
        }
        this.landId = body.landId;
        this.month = body.month;
        this.price = body.price;
        this.createdDate = body.createdDate;
        this.updatedDate = body.updatedDate;
        this.status = body.status;
        if (body.startIndex && body.maxResult) {
            this.setStartIndex(body.startIndex);
            this.setMaxResult(body.maxResult);
        }
    }

    filViaDbObject(incomeModel: IncomeEntity) {
        this.id = incomeModel.id;
        this.month = incomeModel.month;
        this.price = incomeModel.price;
        this.createdDate = incomeModel.createdDate;
        this.updatedDate = incomeModel.updatedDate;
        this.status = incomeModel.status
        this.landId = incomeModel.land.id;
    }

    public getIncomeId(): number {
        return this.id;
    }

    public setIncomeId(id: number): void {
        this.id = id;
    }

    public getMonth(): string {
        return this.month;
    }

    public setMonth(month: string): void {
        this.month = month;
    }

    public getPrice(): number {
        return this.price;
    }

    public setPrice(price: number): void {
        this.price = price;
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
    public getLandId(): number {
        return this.landId;
    }

    public setLandId(landId: number): void {
        this.landId = landId;
    }
}