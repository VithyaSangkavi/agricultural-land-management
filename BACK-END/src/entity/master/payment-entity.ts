import { Column, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Table } from "typeorm";
import { Status } from "../../enum/Status";
import { paymentType } from "../../enum/paymentType";
import { WorkerEntity } from "./worker-entity";
import { worker } from "cluster";

@Entity({
    name: "payment",
})

export class PaymentEntity {
    @PrimaryGeneratedColumn()
    paymentId: number;
   
    @Column({ type: "enum", enum:paymentType, default: paymentType.Monthly})
    paymentType: paymentType;
    
    @Column({type: "double"})
    basePayment: number;

    @Column({type: "double"})
    extraPayment: number;

    @Column({type: "double"})
    attendancePayment: number;

    @Column()
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @Column({ type: "enum", enum:Status, default: Status.Online})
    status: Status;

    // @ManyToOne((type)=> WorkerEntity, (worker) => worker.workerId)
    // @JoinColumn()
    // workerId: number;
}