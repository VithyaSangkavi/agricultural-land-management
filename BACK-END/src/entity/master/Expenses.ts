import { Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";

@Entity({
    name: "expenses",
})

export class ExpensesEntity {
    @PrimaryGeneratedColumn()
    expenses_id: number;

    @Column()
    type: string;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;
    
    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;
}