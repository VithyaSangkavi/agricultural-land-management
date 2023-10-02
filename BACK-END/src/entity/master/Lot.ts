import { Column, Double, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { uStatus } from "../../enum/uStatus";

@Entity({
    name: "lot",
})

export class LotEntity {
    @PrimaryGeneratedColumn()
    lot_id: number;

    @Column()
    land_id: number;

    @Column()
    name: string;

    @Column()
    area: Double;
    
    @Column({ type: "enum", enum:uStatus, default: uStatus.Arce})
    uom: uStatus;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;
}