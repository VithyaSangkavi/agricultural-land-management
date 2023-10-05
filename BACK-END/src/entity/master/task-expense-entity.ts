import { Column, Double, Entity, ManyToOne, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { double } from "aws-sdk/clients/storagegateway";
import { TaskTypeEntity } from "./task-type-entity";
import { ExpensesEntity } from "./expense-entity";

@Entity({
  name: "task-expense",
})
export class TaskExpenseEntity {
  @PrimaryGeneratedColumn({name: "taskExpenseId"})
  id: number;

  @Column({type : "double"})
  value: number;

  @Column()
  createdDate: Date;

  @Column()
  updatedDate: Date;

  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;

  @ManyToOne(()=> TaskTypeEntity, (task) => task.id)
  task: TaskTypeEntity;

  @ManyToOne(()=> ExpensesEntity, (expense) => expense.id)
  expense: ExpensesEntity;
}
