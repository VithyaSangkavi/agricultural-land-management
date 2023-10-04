import { ExpensesEntity } from "../../entity/master/expense-entity";
import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/Status";

export class ExpensesDto extends PaginationDto {
    private id: number;
    private expenseType: string;
    private createdDate: Date;
    private updatedDate: Date;
    private status: Status;

    filViaRequest(body) {

        if (body.id) {
            this.id = body.id;
        }
        this.expenseType = body.expenseType;
        this.createdDate = body.createdDate;
        this.updatedDate = body.updatedDate;
        this.status = body.status;
        if (body.startIndex && body.maxResult) {
            this.setStartIndex(body.startIndex);
            this.setMaxResult(body.maxResult);
        }
    }

    filViaDbObject(expensesModel: ExpensesEntity) {
        this.id = expensesModel.id;
        this.expenseType = expensesModel.expenseType;
        this.createdDate = expensesModel.createdDate;
        this.updatedDate = expensesModel.updatedDate;
        this.status = expensesModel.status
    }

    public getExpensesId(): number {
        return this.id;
    }

    public setExpensesId(id: number): void {
        this.id = id;
    }

    public getExpenseType(): string {
        return this.expenseType;
    }

    public setExpenseType(expenseType: string): void {
        this.expenseType = expenseType;
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
