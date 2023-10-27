import { Column, Double, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { areaUOM } from "../../enum/areaUOM";
import { LandEntity } from "./land-entity";
import { WorkAssignedEntity } from "./work-assigned-entity";

@Entity({
    name: "lot",
})

export class LotEntity {
    @PrimaryGeneratedColumn({name: "lotId"})
    id: number;

    @Column()
    name: string;

    @Column({type: "double"})
    area: number;
    
    @Column({ type: "enum", enum:areaUOM, default: areaUOM.Acre})
    areaUOM: areaUOM;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;

    @ManyToOne(() => LandEntity, (land) => land.lot)
    @JoinColumn({ name: "landId" })
    land: LandEntity;

    @OneToMany(() => WorkAssignedEntity, (workAssigned) => workAssigned.lot)
    workAssiged: WorkAssignedEntity[];
}