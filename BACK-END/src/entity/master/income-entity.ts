import { Column, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { LandEntity } from "./land-entity";

@Entity({
    name: "income",
})

export class IncomeEntity {
    @PrimaryGeneratedColumn({name : "incomeId"})
    id: number;

    @Column()
    month: string;

    @Column({type: "double"})
    price: number;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;

    // @Column()
    // landId: number;

    @ManyToOne(() => LandEntity, (land) => land.income)
    @JoinColumn({ name: "landId" })
    land: LandEntity;
}