import { PaginationDto } from "../pagination-dto";
import { paymentType } from "../../enum/paymentType";
import { Status } from "../../enum/Status";
import { PaymentEntity } from "../../entity/master/payment-entity";

export class PaymentDto extends PaginationDto {
  private id: number;
  private paymentType: paymentType;
  private basePayment: number;
  private extraPayment: number;
  private attendancePayment: number;
  private createdDate: Date;
  private updatedDate: Date;
  private status: Status;
  private workerId: number;

  filViaRequest(body) {
    
    if (body.id) {
      this.id = body.id;
    }
    this.paymentType = body.paymentType;
    this.basePayment = body.basePayment;
    this.extraPayment = body.extraPayment;
    this.attendancePayment = body.attendancePayment;
    this.createdDate = body.createdDate;
    this.updatedDate = body.updatedDate;
    this.status= body.status;
    this.workerId = body.workerId;

    if (body.startIndex && body.maxResult) {
      this.setStartIndex(body.startIndex);
      this.setMaxResult(body.maxResult);
    }
  }

  filViaDbObject(PaymentModel: PaymentEntity) {
    this.id = PaymentModel.id;
    this.paymentType = PaymentModel.paymentType;
    this.basePayment = PaymentModel.basePayment;
    this.extraPayment = PaymentModel.extraPayment;
    this.attendancePayment = PaymentModel.attendancePayment;
    this.createdDate = PaymentModel.createdDate;
    this.updatedDate = PaymentModel.updatedDate;
    this.status = PaymentModel.status;
    this.workerId = PaymentModel.workerId;  
  }

  public getPaymentId(): number {
    return this.id;
  }

  public setpaymentId(id: number): void {
    this.id = id;
  }

  public getPaymentType(): paymentType {
    return this.paymentType;
  }

  public setPaymentType(paymentType: paymentType): void {
    this.paymentType = paymentType;
  }

  public getBasePayment(): number {
    return this.basePayment;
  }

  public setBasePayment(basePayment: number): void {
    this.basePayment = basePayment;
  }

  public getExtraPayment(): number {
    return this.extraPayment;
  }

  public setExtraPayment(extraPayment: number): void {
    this.extraPayment = extraPayment;
  }

  public getAttendancePayment(): number {
    return this.attendancePayment;
  }

  public setAttendancePayment(attendancePayment: number): void {
    this.attendancePayment = attendancePayment;
  }

  public getcreatedDate(): Date {
    return this.createdDate;
  }

  public setcreatedDate(createdDate: Date): void {
    this.createdDate = createdDate;
  }

  public getUpdatedDate(): Date {
    return this.updatedDate;
  }

  public setUpdatedDate(updatedDate: Date): void {
    this.updatedDate = updatedDate;
  }

  public getStatus(): Status {
    return this.status;
  }

  public setStatus(status: Status): void {
    this.status = status;
  }

  public getWorkerId(): number {
    return this.workerId;
  }

  public setWorkerId(workerId: number): void {
    this.workerId = workerId;
  }
}
