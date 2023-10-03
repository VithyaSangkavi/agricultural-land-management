import { Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/status";
import { WorkerStatus } from "../../enum/workerStatus";

@Entity({
  name: "worker",
})
export class WorkerEntity {
  @PrimaryGeneratedColumn()
  workerId: number;

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

  @Column()
  landId: number;
}
