import { Column, Double, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/dStatus";
import { uStatus } from "../../enum/uStatus";

@Entity({
    name: "land",
})

export class LandEntity {
    @PrimaryGeneratedColumn()
    land_id: number;

    @Column()
    name: string;

    @Column()
    area: Double;

    @Column()
    city: string;
    
    @Column({ type: "enum", enum:uStatus, default: uStatus.Arce})
    uom: uStatus;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;
}