import { CommonResponse } from "../../../common/dto/common-response";
import { PaymentDao } from "../../../dao/payment-dao";
import { PaymentDaoImpl } from "../../../dao/impl/payment-dao-impl";
import { PaymentDto } from "../../../dto/master/payment-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { PaymentService } from "../payment-service";
import { WorkerEntity } from "../../../entity/master/worker-entity";
import { worker } from "cluster";
import { WorkerDao } from "../../../dao/worker-dao";
import { WorkerDaoImpl } from "../../../dao/impl/worker-dao-impl";

/**
 * payment service layer
 *
 */
export class PaymentServiceImpl implements PaymentService {
  paymentDao: PaymentDao = new PaymentDaoImpl();
  workerDao: WorkerDao = new WorkerDaoImpl();

  /**
   * save new payment
   * @param paymentDto
   * @returns
   */
  async save(paymentDto: PaymentDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (paymentDto.getPaymentType()) {
        // check name already have
        let typePaymentMode = await this.paymentDao.findByName(paymentDto.getPaymentType());
        if (typePaymentMode) {
          return CommonResSupport.getValidationException("Payment type Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("Payment type Cannot Be null !");
      }

      //check worker id
      let workerModel: WorkerEntity = null;
      if(paymentDto.getWorkerId() > 0){
        workerModel = await this.workerDao.findById(paymentDto.getWorkerId());
      } else{ 
        return CommonResSupport.getValidationException("Crop with the specified ID does not exist!");
      }

      // save new payment
      let newPayment = await this.paymentDao.save(paymentDto, workerModel);
      cr.setStatus(true);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update payment
   * @param paymentDto
   * @returns
   */
  async update(paymentDto: PaymentDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // validation
      if (paymentDto.getPaymentType()) {
        // check name already have
        let typePaymentMode = await this.paymentDao.findByName(paymentDto.getPaymentType());
        if (typePaymentMode && typePaymentMode.id != paymentDto.getPaymentId()) {
          return CommonResSupport.getValidationException("payment Name Already In Use !");
        }
      } else {
        return CommonResSupport.getValidationException("payment Name Cannot Be null !");
      }

      // update payment
      let updatePayment = await this.paymentDao.update(paymentDto);
      if (updatePayment) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Payment Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete payment
   * not delete from db.just update its status as offline
   * @param paymentDto
   * @returns
   */
  async delete(paymentDto: PaymentDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete payment
      let deletePayment = await this.paymentDao.delete(paymentDto);
      if (deletePayment) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("payment Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all payments
   * @returns
   */
  async find(paymentDto: PaymentDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find payment
      let payments = await this.paymentDao.findAll(paymentDto);
      let paymentDtoList = new Array();
      for (const paymentModel of payments) {
        let paymentDto = new PaymentDto();
        paymentDto.filViaDbObject(paymentModel);
        paymentDtoList.push(paymentDto);
      }
      if (paymentDto.getStartIndex() == 0) {
        let count = await this.paymentDao.findCount(paymentDto);
        cr.setCount(count);
      }
      cr.setStatus(true);
      cr.setExtra(paymentDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find payment by id
   * @param paymentId
   * @returns
   */
  async findById(paymentId: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find payment
      let payment = await this.paymentDao.findById(paymentId);

      let paymentDto = new PaymentDto();
      paymentDto.filViaDbObject(payment);

      cr.setStatus(true);
      cr.setExtra(paymentDto);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
}
