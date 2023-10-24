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

exports.findByLandId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const income = await incomeService.findByLandId(req.params.landId);

    res.json(income);
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const incomeId = parseInt(req.params.incomeId, 10);

    if (isNaN(incomeId)) {
      res.status(400).json({ message: 'Invalid income ID' });
      return;
    }

    const result = await incomeService.findById(incomeId);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const incomeId = parseInt(req.params.incomeId, 10);
    const newPrice = parseFloat(req.body.price);

    if (isNaN(incomeId) || isNaN(newPrice)) {
      res.status(400).json({ message: 'Invalid income ID or new price' });
      return;
    }

    const result = await incomeService.updatePrice(incomeId, newPrice);

   
      res.json(result);
 
  } catch (error) {
    next(error);
  }
}
