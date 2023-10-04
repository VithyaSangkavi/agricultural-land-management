import { Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";

@Entity({
    name: "expense",
})

export class ExpensesEntity {
    @PrimaryGeneratedColumn({name: "expenseId"})
    id: number;

    @Column()
    expenseType: string;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;
    
    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;
}