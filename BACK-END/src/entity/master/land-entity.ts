import { Column, Double, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { areaUOM } from "../../enum/areaUOM";
import { LotEntity } from "./lot-entity";
import { CropEntity } from "./crop-entity";
import { WorkerEntity } from "./worker-entity";
import { IncomeEntity } from "./income-entity";
import { TaskAssignedEntity } from "./task-assigned-entity";

@Entity({
    name: "land",
})

export class LandEntity {
    @PrimaryGeneratedColumn({name: "landId"})
    id: number;

    @Column()
    name: string;

    @Column({type: "double"})
    area: number;

    @Column({ type: "enum", enum:areaUOM, default: areaUOM.Acre})
    areaUOM: areaUOM;

    @Column()
    city: string;
    
    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;

    @OneToMany(() => LotEntity, (lot) => lot.land)
    lot: LotEntity[];

    @ManyToOne(() => CropEntity, (crop) => crop.land)
    @JoinColumn({ name: "cropId" })
    crop: CropEntity;

    @OneToMany(() => WorkerEntity, (worker) => worker.land)
    worker: WorkerEntity[];

    @OneToMany(() => IncomeEntity, (income) => income.land)
    income: IncomeEntity[];

    @OneToMany(() => TaskAssignedEntity, (taskAssigned) => taskAssigned.land)
    taskAssigned: TaskAssignedEntity[];
}