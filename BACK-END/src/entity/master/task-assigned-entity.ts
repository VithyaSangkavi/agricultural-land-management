import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { LandEntity } from "./land-entity";
import { TaskTypeEntity } from "./task-type-entity";
import { WorkAssignedEntity } from "./work-assigned-entity";

@Entity({
    name: "task-assigned",
})

export class TaskAssignedEntity {
    @PrimaryGeneratedColumn({name: "taskAssignedId"})
    id: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;
    
    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;

    @ManyToOne(() => LandEntity, (land) => land.id)
    land: LandEntity

    @ManyToOne(() => TaskTypeEntity, (task) => task.id)
    task: TaskTypeEntity

    @OneToMany(() => WorkAssignedEntity, (workAssigned) => workAssigned.id)
    workAssigned: WorkAssignedEntity
}