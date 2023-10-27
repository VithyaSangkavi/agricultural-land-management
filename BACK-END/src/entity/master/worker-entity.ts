import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { WorkerStatus } from "../../enum/workerStatus";
import { PaymentEntity } from "./payment-entity";
import { LandEntity } from "./land-entity";
import { WorkAssignedEntity } from "./work-assigned-entity";

@Entity({
  name: "worker",
})
export class WorkerEntity {
  @PrimaryGeneratedColumn({name: "workerId"})
  id: number;

  @Column()
  name: string;

  @Column()
  dob: Date;

  @Column()
  nic: string;

  @Column()
  gender: string;

  @Column()
  joinedDate: Date;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ type: "enum" ,enum:WorkerStatus,default:WorkerStatus.Active})
  workerStatus: WorkerStatus

  @Column()
  createdDate: Date;

  @Column()
  updatedDate: Date;

  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;

  //fk
  @ManyToOne(()=> LandEntity, (land) => land.worker)
  @JoinColumn({ name: "landId" })
  land: LandEntity;

  @OneToMany(() => PaymentEntity, (payment) => payment.worker)
  payment: PaymentEntity[];
  
  @OneToMany(() => WorkAssignedEntity, (workAssigned) => workAssigned.worker)
  workAssigned: WorkAssignedEntity[];
}
