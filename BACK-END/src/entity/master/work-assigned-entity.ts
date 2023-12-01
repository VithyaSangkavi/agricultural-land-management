import { Column, Double, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { Units } from "../../enum/units";
import { WorkerEntity } from "./worker-entity";
import { TaskTypeEntity } from "./task-type-entity";
import { LotEntity } from "./lot-entity";
import { TaskAssignedEntity } from "./task-assigned-entity";
import { TaskCardEntity } from "./task-card-entity";


@Entity({
  name: "work-assigned",
})
export class WorkAssignedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type : "double", nullable: true})
  quantity: number | null;

  @Column({ type: "enum" , enum: Units, default: Units.KiloGram})
  units: Units

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date | null;

  @Column()
  createdDate: Date;

  @Column()
  updatedDate: Date;

  @Column()
  workDate: string;

  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;

  // @Column({ type: "enum" ,enum:TaskStatus,default:TaskStatus.Ongoing})
  // taskStatus: TaskStatus;

  @ManyToOne(()=> WorkerEntity, (worker) => worker.workAssigned)
  @JoinColumn({ name: "workerId" })
  worker: WorkerEntity;

  @ManyToOne(()=> TaskTypeEntity, (task) => task.workAssigned)
  @JoinColumn({ name: "taskId" })
  task: TaskTypeEntity;

  @ManyToOne(()=> LotEntity, (lot) => lot.workAssiged)
  @JoinColumn({ name: "lotId" })
  lot: LotEntity;

  @ManyToOne(()=> TaskAssignedEntity, (taskAssigned) => taskAssigned.workAssigned)
  @JoinColumn({name: "taskAssignedId"})
  taskAssigned: TaskAssignedEntity;

  @ManyToOne(()=> TaskCardEntity, (taskCard) => taskCard.workAssigned)
  @JoinColumn({name: "taskCardId"})
  taskCard: TaskCardEntity;
}