import { Request, Response, NextFunction } from 'express';
import { ExpensesDto } from '../dto/master/expenses-dto';
import { ExpensesServiceImpl } from '../services/master/impl/expenses-service-impl';

let expensesService = new ExpensesServiceImpl(); 

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let expensesDto = new ExpensesDto();
    expensesDto.filViaRequest(req.body);

    let cr = await expensesService.save(expensesDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let expensesDto = new ExpensesDto();
    expensesDto.filViaRequest(req.body);

    let cr = await expensesService.find(expensesDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};