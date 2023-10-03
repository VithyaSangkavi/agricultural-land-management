import { Column, Double, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/status";
import { mStatus } from "../../enum/mStatus";

@Entity({
    name: "payment",
})

export class PaymentEntity {
    @PrimaryGeneratedColumn()
    paymentId: number;
   
    @Column({ type: "enum", enum:mStatus, default: mStatus.Monthly})
    paymentType: mStatus;
    
    @Column()
    basePayment: Double;

    @Column()
    extraPayment: Double;

    @Column()
    attendancePayment: Double;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;

    @Column()
    workerId: number;
}