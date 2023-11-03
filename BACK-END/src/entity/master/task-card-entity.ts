import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { TaskCardStatus } from "../../enum/taskCardStatus";
import { TaskAssignedEntity } from "./task-assigned-entity";
import { WorkAssignedEntity } from "./work-assigned-entity";

@Entity({
  name: "task-card",
})
export class TaskCardEntity {
  @PrimaryGeneratedColumn({name: "taskCardId"})
  id: number;

  @Column()
  taskAssinnedDate: Date;

  @Column({ type: "enum" ,enum:TaskCardStatus,default:TaskCardStatus.Ongoing})
  cardStatus: TaskCardStatus;

  @Column()
  createdDate: Date;

  @Column()
  updatedDate: Date;

  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;

  @ManyToOne(()=> TaskAssignedEntity, (taskAssigned) => taskAssigned.workAssigned)
  @JoinColumn({name: "taskAssignedId"})
  taskAssigned: TaskAssignedEntity;
}
