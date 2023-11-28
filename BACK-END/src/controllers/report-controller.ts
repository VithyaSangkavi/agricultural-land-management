import { Request, Response, NextFunction } from 'express';
import { ExpensesDto } from '../dto/master/expenses-dto';
import { ReportServiceImpl } from '../services/master/impl/report-service-impl';

let reportService = new ReportServiceImpl(); 

  
exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let expensesDto = new ExpensesDto();
      expensesDto.filViaRequest(req.body);
  
      let cr = await reportService.findExpenses(expensesDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };