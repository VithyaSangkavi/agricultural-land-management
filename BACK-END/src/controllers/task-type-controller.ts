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
      console.log('Reached the /taskFindAll endpoint');
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
      let taskId = parseInt(req.query.taskId as string);
  
      let cr = await taskTypeService.findById(taskId);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
 exports.findTaskNameById = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const taskName = await taskTypeService.findTaskNameById(taskId);
      if (!taskName) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ taskName });
    } catch (error) {
      next(error);
    }
  };

  exports.findTaskNameById = async (req, res, next) => {
    try {
      const taskId = parseInt(req.query.taskId as string);
  
      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Task ID is required as a query parameter' });
      }
  
      const response = await taskTypeService.findTaskNameById(taskId);
  
      res.json(response);
    } catch (error) {
      next(error);
    }
  };