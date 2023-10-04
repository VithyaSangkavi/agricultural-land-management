import { PaginationDto } from "../pagination-dto";
import { mStatus } from "../../enum/paymentType";
import { Status } from "../../enum/status";
import { PaymentEntity } from "../../entity/master/payment-entity";
import { Double } from "typeorm";

export class PaymentDto extends PaginationDto {
  private paymentId: number;
  private paymentType: mStatus;
  private basePayment: Double;
  private extraPayment: Double;
  private attendancePayment: Double;
  private createdDate: Date;
  private updatedDate: Date;
  private status: Status;
  private workerId: number;

  filViaRequest(body) {
    
    if (body.paymentId) {
      this.paymentId = body.paymentId;
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
    this.paymentId = PaymentModel.paymentId;
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
    return this.paymentId;
  }

  public setPaymentId(paymentId: number): void {
    this.paymentId = paymentId;
  }

  public getPaymentType(): mStatus {
    return this.paymentType;
  }

  public setPaymentType(paymentType: mStatus): void {
    this.paymentType = paymentType;
  }

  public getBasePayment(): Double {
    return this.basePayment;
  }

  public setBasePayment(basePayment: Double): void {
    this.basePayment = basePayment;
  }

  public getExtraPayment(): Double {
    return this.extraPayment;
  }

  public setExtraPayment(extraPayment: Double): void {
    this.extraPayment = extraPayment;
  }

  public getAttendancePayment(): Double {
    return this.attendancePayment;
  }

  public setAttendancePayment(attendancePayment: Double): void {
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
