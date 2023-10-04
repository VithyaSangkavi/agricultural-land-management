import { Column, Double, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { uStatus } from "../../enum/areaUOM";

@Entity({
    name: "lot",
})

export class LotEntity {
    @PrimaryGeneratedColumn({name: "lotId"})
    id: number;

    @Column()
    lotName: string;

    @Column({type: "double"})
    area: number;
    
    @Column({ type: "enum", enum:uStatus, default: uStatus.Arce})
    areaUOM: uStatus;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;

    @Column()
    landId: number;

}