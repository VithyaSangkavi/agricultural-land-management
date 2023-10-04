import { Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";

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

    @Column()
    landId: number;
}