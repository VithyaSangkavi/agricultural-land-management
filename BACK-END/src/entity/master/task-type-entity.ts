import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/status";
import { CropEntity } from "./crop-entity";
import { TaskExpenseEntity } from "./task-expense-entity";
import { TaskAssignedEntity } from "./task-assigned-entity";

@Entity({
  name: "task",
})
export class TaskTypeEntity {
  @PrimaryGeneratedColumn({name: "taskId"})
  id: number;

  @Column()
  taskName: string;

  @Column()
  createdDate: Date;

  @Column()
  updatedDate: Date;

  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;

  @ManyToOne(()=> CropEntity, (crop) => crop.id)
  crop: CropEntity;

  @OneToMany(() => TaskExpenseEntity, (taskExpense) => taskExpense.id)
  taskExpense: TaskExpenseEntity

  @OneToMany(() => TaskAssignedEntity, (taskAssigned) => taskAssigned.id)
  taskAssigned: TaskAssignedEntity
}
