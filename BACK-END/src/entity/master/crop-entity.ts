import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { LandEntity } from "./land-entity";
import { TaskTypeEntity } from "./task-type-entity";

@Entity({
    name: "crop",
})

export class CropEntity {
    @PrimaryGeneratedColumn({name: "cropId"})
    id: number;

    @Column()
    cropName: string;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;
    
    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;

    @ManyToOne(() => LandEntity, (land) => land.crop)
    @JoinColumn({ name: "landId" })
    land: LandEntity

    @OneToMany(() => TaskTypeEntity, (task) => task.crop)
    task: TaskTypeEntity[];
}