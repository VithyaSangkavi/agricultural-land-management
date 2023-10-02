import { Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/status";
import { double } from "aws-sdk/clients/lightsail";
import { Units } from "../../enum/units";
import { TaskStatus } from "../../enum/taskStatus";

@Entity({
  name: "work-assigned",
})
export class WorkAssignedEntity {
  @PrimaryGeneratedColumn()
  attendanceId: number;

  @Column()
  quantity: double;

  @Column({ type: "enum" , enum: Units, default: Units.Gram})
  units: Units

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  createdDate: Date;

  @Column()
  updatedDate: String;

  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;

  @Column({ type: "enum" ,enum:TaskStatus,default:TaskStatus.Completed})
  taskStatus: TaskStatus;

  @Column()
  workerId: number;

  @Column()
  taskId: number;

  @Column()
  lotId: number;
}
