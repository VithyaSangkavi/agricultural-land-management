import { Request, Response, NextFunction } from 'express';
import { TaskCardDto } from '../dto/master/task-card-dto';
import { TaskCardServiceImpl } from '../services/master/impl/task-card-service-impl';
import { TaskCardStatus } from '../enum/taskCardStatus';

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

    const id = req.body.id;

    if (!id || id <= 0) {
      return res.status(400).json({ error: "Invalid or missing ID" });
    }

    let cr = await taskCardService.update(taskCardDto, id);

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

exports.findTaskCardByTaskId = async (req, res, next) => {
  try {
    let taskAssignedId = Number(req.query.taskAssignedId);
    console.log('Received taskAssignedId:', taskAssignedId);
    let cr = await taskCardService.findTaskCardByTaskId(taskAssignedId);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const taskCardId = parseInt(req.params.taskCardId, 10);
    const newStatus = req.body.newStatus;

    if (isNaN(taskCardId) || !isValidTaskCardStatus(newStatus)) {
      res.status(400).json({ message: 'Invalid taskCard ID or new status' });
      return;
    }

    const result = await taskCardService.updateStatus(taskCardId, newStatus);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

function isValidTaskCardStatus(status) {
  return Object.values(TaskCardStatus).includes(status);
}