import { getConnection, Like } from "typeorm";
import { PaymentDto } from "../../dto/master/payment-dto";
import { Status } from "../../enum/status";
import { PaymentEntity } from "../../entity/master/payment-entity";
import { PaymentDao } from "../payment-dao";
import { mStatus } from "../../enum/mStatus";

/**
 * payment data access layer
 * contain crud method
 */
export class PaymentDaoImpl implements PaymentDao {
  async save(paymentDto: PaymentDto): Promise<PaymentEntity> {
    let paymentRepo = getConnection().getRepository(PaymentEntity);
    let paymentModel = new PaymentEntity();

    paymentModel.status = Status.Online;
    this.preparePaymentModel(paymentModel, paymentDto);
    let savedWorker = await paymentRepo.save(paymentModel);
    return savedWorker;
  }
  async update(paymentDto: PaymentDto): Promise<PaymentEntity> {
    let paymentRepo = getConnection().getRepository(PaymentEntity);
    let paymentModel = await paymentRepo.findOne(paymentDto.getPaymentId());
    if (paymentModel) {
      this.preparePaymentModel(paymentModel, paymentDto);
      let updatedModel = await paymentRepo.save(paymentModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(paymentDto: PaymentDto): Promise<PaymentEntity> {
    let paymentRepo = getConnection().getRepository(PaymentEntity);
    let paymentModel = await paymentRepo.findOne(paymentDto.getPaymentId());
    if (paymentModel) {
      paymentModel.status = Status.Offline;
      let updatedModel = await paymentRepo.save(paymentModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(paymentDto: PaymentDto): Promise<PaymentEntity[]> {
    let paymentRepo = getConnection().getRepository(PaymentEntity);
    let searchObject: any = this.prepareSearchObject(paymentDto);
    let paymentModel = await paymentRepo.find({
      where: searchObject,
      skip: paymentDto.getStartIndex(),
      take: paymentDto.getMaxResult(),
      order:{paymentId:"DESC"}
    });
    return paymentModel;
  }
  async findCount(paymentDto: PaymentDto): Promise<number> {
    let paymentRepo = getConnection().getRepository(PaymentEntity);
    let searchObject: any = this.prepareSearchObject(paymentDto);
    let paymentModel = await paymentRepo.count({ where: searchObject });
    return paymentModel;
  }
  async findById(workerId: number): Promise<PaymentEntity> {
    let paymentRepo = getConnection().getRepository(PaymentEntity);
    let paymentModel = await paymentRepo.findOne(workerId);
    return paymentModel;
  }

  async findByName(name: String): Promise<PaymentEntity> {
    let paymentRepo = getConnection().getRepository(PaymentEntity);
    let paymentModel = await paymentRepo.findOne({ where: { name: name, status: Status.Online } });
    return paymentModel;
  }
  async preparePaymentModel(paymentModel: PaymentEntity, paymentDto: PaymentDto) {
    paymentModel.paymentType = paymentDto.getPaymentType();
    paymentModel.basePayment = paymentDto.getBasePayment();
    paymentModel.extraPayment = paymentDto.getExtraPayment();
    paymentModel.attendancePayment = paymentDto.getAttendancePayment();
    paymentModel.createdDate = paymentDto.getcreatedDate();
    paymentModel.updatedDate = paymentDto.getUpdatedDate();
    paymentModel.status = paymentDto.getStatus();
    paymentModel.workerId = paymentDto.getWorkerId();
  }
  prepareSearchObject(paymentDto: PaymentDto): any {
    let searchObject: any = {};

    searchObject.paymentType = mStatus.Daily;

    if (paymentDto.getBasePayment()) {
      searchObject.basePayment = Like("%" + paymentDto.getBasePayment() + "%");
    }
    if (paymentDto.getExtraPayment()) {
      searchObject.extraPayment = Like("%" + paymentDto.getExtraPayment() + "%");
    }
    if (paymentDto.getAttendancePayment()) {
        searchObject.attendancePayment = Like("%" + paymentDto.getAttendancePayment() + "%");
    }
    if (paymentDto.getcreatedDate()) {
        searchObject.createdDate = Like("%" + paymentDto.getcreatedDate() + "%");
    }
    if (paymentDto.getUpdatedDate()) {
        searchObject.updatedDate = Like("%" + paymentDto.getUpdatedDate() + "%");
    }

    searchObject.status = Status.Online;

    if (paymentDto.getWorkerId()) {
        searchObject.workerId = Like("%" + paymentDto.getWorkerId() + "%");
    }
    return searchObject;
  }
}
