import { ExpensesEntity } from "../../entity/master/Expenses";
import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/status";

export class ExpensesDto extends PaginationDto {
    private expenses_id: number;
    private type: string;
    private createdDate: Date;
    private updatedDate: Date;
    private status: Status;

    filViaRequest(body) {

        if (body.expenses_id) {
            this.expenses_id = body.expenses_id;
        }
        this.type = body.type;
        this.createdDate = body.createdDate;
        this.updatedDate = body.updatedDate;
        this.status = body.status;
        if (body.startIndex && body.maxResult) {
            this.setStartIndex(body.startIndex);
            this.setMaxResult(body.maxResult);
        }
    }

    filViaDbObject(expensesModel: ExpensesEntity) {
        this.expenses_id = expensesModel.expenses_id;
        this.type = expensesModel.type;
        this.createdDate = expensesModel.createdDate;
        this.updatedDate = expensesModel.updatedDate;
        this.status = expensesModel.status
    }

    public getExpensesId(): number {
        return this.expenses_id;
    }

    public setExpensesId(expenses_id: number): void {
        this.expenses_id = expenses_id;
    }

    public getType(): string {
        return this.type;
    }

    public setType(type: string): void {
        this.type = type;
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
