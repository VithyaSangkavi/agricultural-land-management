import { Column, Double, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";

@Entity({
    name: "income",
})

export class IncomeEntity {
    @PrimaryGeneratedColumn()
    income_id: number;

    @Column()
    land_id: number;

    @Column()
    month: string;

    value: Double;
    @Column()

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;
}