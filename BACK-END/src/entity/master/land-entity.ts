import { Column, Double, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { uStatus } from "../../enum/areaUOM";

@Entity({
    name: "land",
})

export class LandEntity {
    @PrimaryGeneratedColumn({name: "landId"})
    id: number;

    @Column()
    landName: string;

    @Column({type: "double"})
    area: number;

    @Column({ type: "enum", enum:uStatus, default: uStatus.Arce})
    areaUOM: uStatus;

    @Column()
    city: string;
    
    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;
}