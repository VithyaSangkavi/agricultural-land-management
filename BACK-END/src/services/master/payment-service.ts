import { CommonResponse } from "../../common/dto/common-response";
import { PaymentDto } from "../../dto/master/payment-dto";

export interface PaymentService {
  save(paymenPaymentDto:PaymentDto): Promise<CommonResponse>;
  update(paymenPaymentDto:PaymentDto): Promise<CommonResponse>;
  delete(paymenPaymentDto:PaymentDto): Promise<CommonResponse>;
  find(paymenPaymentDto:PaymentDto): Promise<CommonResponse>;
  findById(paymentId: number): Promise<CommonResponse>;
  findByWorkerId(workerId: number): Promise<CommonResponse>;
}
