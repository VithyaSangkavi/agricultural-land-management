import { Request, Response, NextFunction } from 'express';
import { TaskTypeDto } from '../dto/master/task-type-dto';
import { TaskTypeServiceImpl } from '../services/master/impl/task-type-service-impl';

let taskTypeService = new TaskTypeServiceImpl(); 

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Reached the /taskSave endpoint');
    let taskTypeDto = new TaskTypeDto();
    taskTypeDto.filViaRequest(req.body);

    let cr = await taskTypeService.save(taskTypeDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let taskTypeDto = new TaskTypeDto();
      taskTypeDto.filViaRequest(req.body);
  
      let cr = await taskTypeService.update(taskTypeDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let taskTypeDto = new TaskTypeDto();
      taskTypeDto.filViaRequest(req.body);
  
      let cr = await taskTypeService.delete(taskTypeDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let taskTypeDto = new TaskTypeDto();
      taskTypeDto.filViaRequest(req.body);
  
      let cr = await taskTypeService.find(taskTypeDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let workerId = parseInt(req.query.workerId as string);
  
      let cr = await taskTypeService.findById(workerId);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
