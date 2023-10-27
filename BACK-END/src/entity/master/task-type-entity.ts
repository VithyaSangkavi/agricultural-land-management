import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { CropEntity } from "./crop-entity";
import { TaskExpenseEntity } from "./task-expense-entity";
import { TaskAssignedEntity } from "./task-assigned-entity";
import { WorkAssignedEntity } from "./work-assigned-entity";

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

  @ManyToOne(()=> CropEntity, (crop) => crop.task)
  @JoinColumn({ name: "cropId" })
  crop: CropEntity;

  @OneToMany(() => TaskExpenseEntity, (taskExpense) => taskExpense.taskType)
  taskExpense: TaskExpenseEntity[];

  @OneToMany(() => TaskAssignedEntity, (taskAssigned) => taskAssigned.task)
  taskAssigned: TaskAssignedEntity[];

  @OneToMany(() => WorkAssignedEntity, (workAssigned) => workAssigned.task)
  workAssigned: WorkAssignedEntity[];
}
