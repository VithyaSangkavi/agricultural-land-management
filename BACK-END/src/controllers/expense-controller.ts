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

exports.findIdByType = async (req, res, next) => {
  try {
    const { expenseType } = req.query;

    if (!expenseType) {
      return res.status(400).json({ error: 'ExpenseType parameter is required' });
    }

    const cr = await expensesService.findIdByType(expenseType);

    if (cr.getStatus()) {
      res.status(200).json({ expenseId: cr.getExtra() });
    } else {
      res.status(404).json({ error: cr.getExtra() });
    }
  } catch (error) {
    next(error);
  }
};
