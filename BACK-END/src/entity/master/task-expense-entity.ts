import { Column, Double, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/status";
import { double } from "aws-sdk/clients/storagegateway";

@Entity({
  name: "task-expense",
})
export class TaskExpenseEntity {
  @PrimaryGeneratedColumn()
  taskExpenseId: number;

  @Column()
  value: Double;

  @Column()
  createdDate: Date;

  @Column()
  updatedDate: Date;

  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;

  @Column()
  taskId: number;

  @Column()
  expenseId: number
}
