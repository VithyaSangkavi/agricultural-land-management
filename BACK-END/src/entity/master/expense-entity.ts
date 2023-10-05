import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/status";
import { TaskExpenseEntity } from "./task-expense-entity";

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

    @OneToMany(() => TaskExpenseEntity, (taskExpense) => taskExpense.id)
    taskExpense: TaskExpenseEntity
}