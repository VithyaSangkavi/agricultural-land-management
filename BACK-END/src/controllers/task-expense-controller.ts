import { Request, Response, NextFunction } from 'express';
import { TaskExpenseDto } from '../dto/master/task-expense-dto';
import { TaskExpenseServiceImpl } from '../services/master/impl/task-expense-service-impl';

let taskExpenseService = new TaskExpenseServiceImpl(); 

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Reached the /task-assigned-save endpoint');
    let taskExpenseDto = new TaskExpenseDto();
    taskExpenseDto.filViaRequest(req.body);

    let cr = await taskExpenseService.save(taskExpenseDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let taskExpenseDto = new TaskExpenseDto();
      taskExpenseDto.filViaRequest(req.body);
  
      let cr = await taskExpenseService.update(taskExpenseDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let taskExpenseDto = new TaskExpenseDto();
      taskExpenseDto.filViaRequest(req.body);
  
      let cr = await taskExpenseService.delete(taskExpenseDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let taskExpenseDto = new TaskExpenseDto();
      taskExpenseDto.filViaRequest(req.body);
  
      let cr = await taskExpenseService.find(taskExpenseDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let taskExpenseId = parseInt(req.query.taskExpenseId as string);
  
      let cr = await taskExpenseService.findById(taskExpenseId);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };

  exports.findByTaskAssignedId = async (req: Request, res: Response) => {
    try {
      let taskExpenseDto = new TaskExpenseDto();
      
      const taskAssignedId = req.query.taskAssignedId;
      taskExpenseDto.setTaskAssignedId(taskAssignedId);

      let cr = await taskExpenseService.taskExpensefindBytaskAssignedId(taskExpenseDto);
  
      res.send(cr);
    } catch (error) {
      (error);
    }
  };