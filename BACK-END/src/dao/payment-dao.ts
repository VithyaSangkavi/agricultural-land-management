import { PaymentDto } from "../dto/master/payment-dto"
import { PaymentEntity } from "../entity/master/payment-entity";
import { mStatus } from "../enum/paymentType";

export interface PaymentDao {
  save(paymentDto: PaymentDto): Promise<PaymentEntity>;
  update(paymentDto: PaymentDto): Promise<PaymentEntity>;
  delete(paymentDto: PaymentDto): Promise<PaymentEntity>;
  findAll(paymentDto: PaymentDto): Promise<PaymentEntity[]>;
  findById(paymentId: number): Promise<PaymentEntity>;
  //findByName(paymentType: mStatus): Promise<PaymentEntity>;
  findCount(paymentDto: PaymentDto): Promise<number> ;
}