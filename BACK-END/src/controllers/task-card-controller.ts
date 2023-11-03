import { Request, Response, NextFunction } from 'express';
import { TaskCardDto } from '../dto/master/task-card-dto';
import { TaskCardServiceImpl } from '../services/master/impl/task-card-service-impl';

let taskCardService = new TaskCardServiceImpl();

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Reached the /task-card-save endpoint');
    let taskCardDto = new TaskCardDto();
    taskCardDto.filViaRequest(req.body);

    let cr = await taskCardService.save(taskCardDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let taskCardDto = new TaskCardDto();
    taskCardDto.filViaRequest(req.body);

    let cr = await taskCardService.update(taskCardDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let taskCardDto = new TaskCardDto();
    taskCardDto.filViaRequest(req.body);

    let cr = await taskCardService.delete(taskCardDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let taskCardDto = new TaskCardDto();
    taskCardDto.filViaRequest(req.body);

    let cr = await taskCardService.find(taskCardDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let taskCardId = parseInt(req.query.taskCardId as string);

    let cr = await taskCardService.findById(taskCardId);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

