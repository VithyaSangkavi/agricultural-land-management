import { Request, Response, NextFunction } from 'express';
import { IncomeDto } from '../dto/master/income-dto';
import { IncomeServiceImpl } from '../services/master/impl/income-service-impl';

let incomeService = new IncomeServiceImpl(); 

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let incomeDto = new IncomeDto();
    incomeDto.filViaRequest(req.body);

    let cr = await incomeService.save(incomeDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let incomeDto = new IncomeDto();
    incomeDto.filViaRequest(req.body);

    let cr = await incomeService.find(incomeDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};