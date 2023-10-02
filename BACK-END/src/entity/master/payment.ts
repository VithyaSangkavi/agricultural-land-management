import { Column, Double, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/dStatus";
import { uStatus } from "../../enum/uStatus";
import { mStatus } from "../../enum/mStatus";

@Entity({
    name: "payment",
})

export class PaymentEntity {
    @PrimaryGeneratedColumn()
    payment_id: number;

    @Column()
    worker_id: number;
   
    @Column({ type: "enum", enum:mStatus, default: mStatus.Monthly})
    mStatus: uStatus;
    
    @Column()
    base_payment: Double;

    @Column()
    extra_payment: Double;

    @Column()
    attendence_payment: Double;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;
}