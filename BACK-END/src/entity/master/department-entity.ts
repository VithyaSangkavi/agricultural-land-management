import { Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";

@Entity({
  name: "department",
})
export class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({name: "deptName"})
  name: string;
  @Column()
  color: string;
  @Column({ type: "enum" ,enum:Status,default:Status.Online})
  status: Status;
}
