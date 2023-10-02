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
  nic: String;

  @Column()
  gender: String;

  @Column()
  joinedDate: Date;

  @Column()
  phone: String;

  @Column()
  address: String;

  @Column({ type: "enum" ,enum:WorkerStatus,default:WorkerStatus.Active})
  workerStatus: WorkerStatus

  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;
}
