import { Request, Response, NextFunction } from 'express';
import { PaymentDto } from '../dto/master/payment-dto';
import { PaymentServiceImpl } from '../services/master/impl/payment-service-impl';

let paymentService = new PaymentServiceImpl();

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Reached the /paymentSave endpoint');
    let paymentDto = new PaymentDto();
    paymentDto.filViaRequest(req.body);

    let cr = await paymentService.save(paymentDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let paymentDto = new PaymentDto();

    const paymentIdFromQuery = req.query.paymentId;

    if (paymentIdFromQuery) {
      paymentDto.setpaymentId(Number(paymentIdFromQuery));
    } else {
      console.error('paymentId not found in the query parameters');
      return res.status(400).json({ error: 'paymentId not found in the query parameters' });
    }
    console.log('Controller paymentId:', paymentDto.getPaymentId());

    paymentDto.filViaRequest(req.body);

    let cr = await paymentService.update(paymentDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let paymentDto = new PaymentDto();
    paymentDto.filViaRequest(req.body);

    let cr = await paymentService.delete(paymentDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let paymentDto = new PaymentDto();
    paymentDto.filViaRequest(req.body);

    let cr = await paymentService.find(paymentDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let paymentId = parseInt(req.query.paymentId as string);

    let cr = await paymentService.findById(paymentId);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findByWorkerId = async (req: Request, res: Response) => {
  try {
    const workerId = Number(req.query.workerId);
    console.log('Received workerId:', workerId);
    const result = await paymentService.findByWorkerId(workerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}