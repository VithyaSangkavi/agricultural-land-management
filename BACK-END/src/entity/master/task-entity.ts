import { Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";

@Entity({
  name: "task",
})
export class TaskEntity {
  @PrimaryGeneratedColumn()
  taskId: number;

  @Column()
  taskName: string;

  @Column()
  createdDate: Date;

  @Column()
  updatedDate: Date;

  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;

  @Column()
  cropId: number;
}
