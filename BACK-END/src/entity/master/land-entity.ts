import { Column, Double, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { areaUOM } from "../../enum/areaUOM";

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
}