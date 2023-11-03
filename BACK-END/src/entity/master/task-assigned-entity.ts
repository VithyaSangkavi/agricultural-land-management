import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { LandEntity } from "./land-entity";
import { TaskTypeEntity } from "./task-type-entity";
import { WorkAssignedEntity } from "./work-assigned-entity";
import { TaskStatus } from "../../enum/taskStatus";
import { TaskCardEntity } from "./task-card-entity";

@Entity({
    name: "task-assigned",
})

export class TaskAssignedEntity {
    @PrimaryGeneratedColumn({name: "taskAssignedId"})
    id: number;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date | null;
    
    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;

    @Column({ type: "enum" ,enum:TaskStatus,default:TaskStatus.Ongoing})
    taskStatus: TaskStatus;

    @ManyToOne(() => LandEntity, (land) => land.taskAssigned)
    @JoinColumn({ name: "landId" })
    land: LandEntity

    @ManyToOne(() => TaskTypeEntity, (task) => task.taskAssigned)
    @JoinColumn({ name: "taskId" })
    task: TaskTypeEntity

    @OneToMany(() => WorkAssignedEntity, (workAssigned) => workAssigned.taskAssigned)
    workAssigned: WorkAssignedEntity[];

    @OneToMany(() => TaskCardEntity, (taskCard) => taskCard.taskAssigned)
    taskCard: TaskCardEntity[];
}