import { Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/dStatus";

@Entity({
    name: "crop",
})

export class CropEntity {
    @PrimaryGeneratedColumn()
    crop_id: number;

    @Column()
    land_id: number;

    @Column()
    name: string;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;
    
    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;
}