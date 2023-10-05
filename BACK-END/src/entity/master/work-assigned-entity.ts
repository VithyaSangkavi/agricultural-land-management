import { Column, Double, Entity, ManyToOne, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { Units } from "../../enum/units";
import { TaskStatus } from "../../enum/taskStatus";
import { WorkerEntity } from "./worker-entity";
import { TaskTypeEntity } from "./task-type-entity";
import { LotEntity } from "./lot-entity";
import { TaskAssignedEntity } from "./task-assigned-entity";

@Entity({
  name: "work-assigned",
})
export class WorkAssignedEntity {
  @PrimaryGeneratedColumn({name: "workAssignedId"})
  id: number;

  @Column({type : "double"})
  quantity: number;

  @Column({ type: "enum" , enum: Units, default: Units.Gram})
  units: Units

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  createdDate: Date;

  @Column()
  updatedDate: Date;

  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;

  @Column({ type: "enum" ,enum:TaskStatus,default:TaskStatus.Completed})
  taskStatus: TaskStatus;

  @ManyToOne(()=> WorkerEntity, (worker) => worker.id)
  worker: WorkerEntity;

  @ManyToOne(()=> TaskTypeEntity, (task) => task.id)
  task: TaskTypeEntity;

  @ManyToOne(()=> LotEntity, (lot) => lot.id)
  lot: LotEntity;

  @ManyToOne(()=> TaskAssignedEntity, (taskAssigned) => taskAssigned.id)
  taskAssigned: TaskAssignedEntity;
}
