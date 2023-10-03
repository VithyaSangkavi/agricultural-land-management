import { Column, Double, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/status";

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

    @Column()
    value: Double;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;
}